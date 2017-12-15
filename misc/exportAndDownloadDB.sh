#!/bin/bash

#ssh to aliyun server and export the data (according the argument of database ) from mongo.
#then download it from server 


#the arguments : ./sh  [deanchen|oliver]
DATABASE_NAME=$1

if [ "${DATABASE_NAME}" != "deanchen" -a "${DATABASE_NAME}" != "oliver" ];then
	echo "the database name is invalid:'${DATABASE_NAME}'!"
	exit 1
fi

if [ "${DATABASE_NAME}" == "deanchen" ];then
	DATABASE_NUMBER=1
elif [ "${DATABASE_NAME}" == "oliver" ];then
	DATABASE_NUMBER=2
fi

echo "to export and download database :'${DATABASE_NAME}', database number:${DATABASE_NUMBER}!"

echo "export & download hashtag"
ssh root@115.28.191.92 /usr/local/mongodb/bin/mongoexport -d dev --jsonArray -c hashTags_${DATABASE_NUMBER}  -o /root/temp/${DATABASE_NAME}_hashtags.txt
scp root@115.28.191.92:/root/temp/${DATABASE_NAME}_hashtags.txt ~/temp/
ls -l ~/temp/${DATABASE_NAME}_hashtags.txt

echo "export & download logs"
ssh root@115.28.191.92 /usr/local/mongodb/bin/mongoexport -d dev --jsonArray -c loggets_${DATABASE_NUMBER}  -o /root/temp/${DATABASE_NAME}_logs.txt
scp root@115.28.191.92:/root/temp/${DATABASE_NAME}_logs.txt ~/temp/
ls -l ~/temp/${DATABASE_NAME}_logs.txt
