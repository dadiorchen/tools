#!/bin/bash
#first , check the argument of command
echo $1
isTest=true
if [ $1 == "mode=test" ];then
	echo "TEST"
	isTest=true
elif [ $1 == "mode=production" ];then
	echo "PRODUCTION"
	isTest=false
else
	echo "do not set the mode,usage: mode=test | mode=production "
	exit 1;
fi

echo "begin..."
echo "isTest:$isTest"
