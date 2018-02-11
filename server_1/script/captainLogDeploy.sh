#!/bin/bash
# this script is to deploy captain log on server 1 , include both  test and PRODUCTION  ! 
# USAGE : 
#  captainLogDeploy.sh [environment] [branch] 
#  [environment] : 
#		* test : to deploy test environment , the source is : /root/work/logger_front/
#		* production : to deploy production environment , the source code is : /root/work/production/logger_front/
#  [branch] :
#		* the git branch name to deploy

ENVIRONMENT=$1
BRANCH=$2
echo "begin to deploy to environment:${ENVIRONMENT}"
echo "using branch:${BRANCH}"

assertExit(){
	if [ "$?" != "0" ];then
		echoColor red "command execute failure, quit!"
		exit 1
	fi
}

if [ "${ENVIRONMENT}" != "test" -a "${ENVIRONMENT}" != "production" ];then
	echoColor red "please input the correct environment name,is expected to be :(test|prodcution),now its:'$ENVIRONMENT' , quit!"
	exit 1
fi

if [ "${BRANCH}" = "" ];then
	echoColor red "please input a branch name!"
	exit 1
fi

if [ "${ENVIRONMENT}" = "test" ];then
	echo "its environment for test, go to test directory , and git pull the code "
	WORK_DIRECTORY="/root/work/logger_front/"
elif [ "${ENVIRONMENT}" = "production" ];then
	echo "its environment for production, go to test directory , and git pull the code "
	WORK_DIRECTORY="/root/work/production/logger_front/"
	echoColor red "is to deploy to production environment , are you sure?"
	read -p "[y/n]" CONFIRM
	if [ "${CONFIRM}" != "y" ];then
		exit 1
	fi
fi
cd ${WORK_DIRECTORY}
echo "! git status ------------------------------------"
git status
assertExit
echo "! git pull --------------------------------------"
git pull --no-edit
assertExit
echo "! git switch to the target branch ---------------"
git checkout ${BRANCH}
assertExit
if [ "${ENVIRONMENT}" = "production" ];then
	echo "! copy the production index.html file"
	cp ./public/index.html.production ./public/index.html
	assertExit
fi
echoColor green "deploy success!"	
