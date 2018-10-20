#!/bin/bash
#New version of backup script, just call couchdb-dump to backup db
#backup target :
#	* account
#	* dean 
#	* help

#Prepare the ENV
BACKUP_DIR="/data/backup/production.new"
TIMESTAMP=$(date "+%Y%m%d-%H%M%S")
SERVER="127.0.0.1"
PORT="5984"
DATABASES=("account" "note-u-062c50f0-8ee6-11e8-b592-ed316bcdccd5" "note-u-224e8f40-8eec-11e8-b592-ed316bcdccd5");
DATABASE_USER=midinoteAdmin
DATABASE_PASSWORD=Discuit1145
echo "begin..."
echo "setting: backup dir:${BACKUP_DIR};server:${SERVER};port:${PORT};db user:${DATABASE_USER};password:${DATABASE_PASSWORD};"

for DATABASE in ${DATABASES[@]}; do
	CMD="bash /home/ec2-user/code/couchdb-dump/couchdb-backup.sh -b -H ${SERVER} -d ${DATABASE}  -f ${BACKUP_DIR}/${DATABASE}.${TIMESTAMP}.json -u ${DATABASE_USER} -p ${DATABASE_PASSWORD}"
	echo ${CMD}
	`${CMD}`
done
echo "Done!" 
## Adjust the location as appropriate.
#if [ $isTest == "true" ];then
#	DATABASES=("test");
#else
#	BACKUP_DIR="/data/backup/production"
#fi
#mkdir -p $BACKUP_DIR
#TAR_FILE="${BACKUP_DIR}/couch-backup-${TIMESTAMP}.tar.gz"
#
# 
#FILES=""
#for DATABASE in ${DATABASES[@]}; do
#	echo "deal with ${DATABASE}"
#	FILE="/tmp/${DATABASE}.json"
#
#	curl -X GET \
#		http://${SERVER}:${PORT}/${DATABASE}/_all_docs?include_docs=true \
#		> ${FILE}
#	# Build a list of the files to add to the archive.
#	FILES="${FILES} ${FILE}"
#	echo "FILES : ${FILES}"
#done
# 
## Tar and gzip the exported files.
#echo "backup data to file:${TAR_FILE};"
#tar -zcf ${TAR_FILE} ${FILES}
