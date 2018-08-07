#!/bin/bash
# Restore a backup to CouchDB, by indicating a db file
# usage : restoreBackup.sh [backupFile] [databaseToImport]

BACKUP_FILE=$1 
DATABASE=$2
echo "the backup file:${BACKUP_FILE}"
echo "the import database:${DATABASE}"
#check the file exist
if [ ! -f "$1" ];then
	echo "the file $1 do not exist, quit"
	exit 1
fi

SERVER="127.0.0.1"
PORT="5984"
ADMIN="midinoteAdmin"
PWD="Discuit1145"

#convert the data file for import
IMPORT_FILE=${DATABASE}-import.json
echo > ${IMPORT_FILE}
echo '{"docs":[' >> "${IMPORT_FILE}"
cat "${BACKUP_FILE}" | \
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
	${REMOTE_URL}/_bulk_docs  > /tmp/restoreBackupLog
head -c 400 /tmp/restoreBackupLog
echo ""
echo "backup finished!the imported database '${DATABASE}'"


