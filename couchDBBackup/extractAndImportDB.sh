#!/bin/bash
# extract the backup file (gz) and convert it to fit the couch DB import , then import it to the DB server
# usage : ./extractAndImportDB.sh [backupFile] [databaseName]
# description: the backup file is separate to test/production files in :/data/backup/test and /data/backup/production
# the database name must be one of : test_logger_deanchen  test_logger_oliver logger_deanchen logger_oliver

TAR_FILE=$1
DATABASE=$2
echo "the tar file:${TAR_FILE}"
echo "the database : ${DATABASE}"
#check the file exist
if [ ! -f "$1" ];then
	echo "the file $1 do not exist, quit"
	exit 1
fi
TAR_FILE="$1"
#"/data/backup/test/couch-backup-20171210-221513.tar.gz"

if [ "$2" != "test_logger_deanchen" -a "$2" != "test_logger_oliver" -a "$2" != "logger_deanchen" -a "$2" != "logger_oliver" ];then
	echo "the database name is wrong :'$2' , quit!"
	exit 1
fi
DATABASE="$2"
#"test_logger_deanchen"

SERVER="192.168.31.180"
PORT="5984"
ADMIN="admin"
PWD="admin"
OUT_DIR="/tmp/datafile"
mkdir $OUT_DIR
rm -rf ${OUT_DIR}/*
tar -zxf ${TAR_FILE} -C ${OUT_DIR}
ls -l `${OUT_DIR}/tmp`

#convert the data file for import
EXPORT_FILE=${OUT_DIR}/tmp/${DATABASE}.json
if [ ! -f "$EXPORT_FILE" ];then
	echo "the export file do not exist:${EXPORT_FILE},quit"
	exit 1
fi
IMPORT_FILE=${OUT_DIR}/tmp/${DATABASE}-import.json
echo > ${IMPORT_FILE}
echo '{"docs":[' >> "${IMPORT_FILE}"
cat "${EXPORT_FILE}" | \
	sed 's/{"total_rows":.*,"offset":.*,"rows":\[//' | \
	sed 's/.$//'  | \
	sed 's/{"id":.*,"key".*,"value":.*,"doc"://' | \
	sed 's/"_rev":"[^"]*",\?//' | \
	sed 's/},$/,/' | \
	sed 's/,}/}/' | \
	sed 's/}$//' \
	>> "${IMPORT_FILE}"
echo "}" >> "${IMPORT_FILE}"
echo "the converted file:"
ls -l "${OUT_DIR}/tmp"

#import to database
REMOTE_URL=http://${ADMIN}:${PWD}@${SERVER}:${PORT}/${DATABASE}
echo "delete the database"
curl -X DELETE $REMOTE_URL
echo "create the database"
curl -X PUT $REMOTE_URL
echo "import data to server:${REMOTE_URL}"
curl -d @"${IMPORT_FILE}" \
	-X POST \
	-H 'Content-Type: application/json' \
	${REMOTE_URL}/_bulk_docs  > /tmp/couchDBBackupLog
head -c 400 /tmp/couchDBBackupLog
echo ""
echo "backup finished!the imported database '${DATABASE}'"


