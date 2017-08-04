#!/bin/bash
DEPLOY_BUILD_DIR="/Users/deanchen/work/deploy/logger_front/"
DEPLOY_ROOT="$DEPLOY_BUILD_DIR/build/"
DEPLOY_TAR="$DEPLOY_BUILD_DIR/build.tar.gz"
REPLACE_ORGIN_IP="192.168.31.149"
REPLACE_TARGET_IP="115.28.191.92"
REMOTE_DEPLOY_DIR="/root/app/deploy_files"
REMOTE_PRODUCTION_DIR="/root/app/logger_front"
echo "the deploy root:$DEPLOY_ROOT"
echo "the deploy target tar file:$DEPLOY_TAR"



echo "git update"
cd $DEPLOY_BUILD_DIR
git pull origin master 
echo "build react..."
npm run build
echo "ls the deploy root:"
ls $DEPLOY_ROOT
cd $DEPLOY_ROOT
echo "try to replace the ip from $REPLACE_ORGIN_IP to $REPLACE_TARGET_IP in files:"
grep "$REPLACE_ORGIN_IP" -rl $DEPLOY_ROOT
sed -i "" "s/`echo $REPLACE_ORGIN_IP`/`echo $REPLACE_TARGET_IP`/g" `grep "$REPLACE_ORGIN_IP" -rl $DEPLOY_ROOT`
echo "the $REPLACE_TARGET_IP in files"
grep "$REPLACE_TARGET_IP" -rl $DEPLOY_ROOT

#create tar file
tar -czf `echo $DEPLOY_TAR` `echo $DEPLOY_ROOT`
echo "the build tar file:"
ls -l `echo $DEPLOY_TAR`

#copy to server
echo "copy tar to aliyun server..."
scp $DEPLOY_TAR root@$REPLACE_TARGET_IP:$REMOTE_DEPLOY_DIR
echo "the files on server:"
ssh root@$REPLACE_TARGET_IP  ls -l $REMOTE_DEPLOY_DIR/build.tar.gz

#extract
echo "extract file..."
ssh root@$REPLACE_TARGET_IP  tar -zxf $REMOTE_DEPLOY_DIR/build.tar.gz -C $REMOTE_DEPLOY_DIR/
echo "the dir to deploy:"
ssh root@$REPLACE_TARGET_IP  ls -l $REMOTE_DEPLOY_DIR/$DEPLOY_ROOT

#remove the prodcut dir
echo "remove the product dir"
ssh root@$REPLACE_TARGET_IP  rm -rf $REMOTE_PRODUCTION_DIR/*
echo "copy the new dir to it:"
ssh root@$REPLACE_TARGET_IP cp -R $REMOTE_DEPLOY_DIR/$DEPLOY_ROOT/* $REMOTE_PRODUCTION_DIR/
echo "the new production dir files:"
ssh root@$REPLACE_TARGET_IP ls -l $REMOTE_PRODUCTION_DIR




