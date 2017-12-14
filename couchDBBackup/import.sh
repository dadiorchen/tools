#!/bin/bash
#
# Import documents from the import format files associated
# with the given databases.
#
 
# Either a server admin or a database admin user assigned to
# all of the databases in the list.
ADMIN="admin"
PWD="admin"
SERVER="192.168.31.180"
PORT="5984"
DATABASES=("logger_deanchen" "logger_oliver")
 
for DATABASE in ${DATABASES[@]}; do
  IMPORT_FILE=/data/backup/tmp/${DATABASE}-import.json
  curl -d @"${IMPORT_FILE}" \
    -X POST \
    -H 'Content-Type: application/json' \
    http://${ADMIN}:${PWD}@${SERVER}:${PORT}/${DATABASE}/_bulk_docs
done
