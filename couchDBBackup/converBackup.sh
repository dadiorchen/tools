#!/bin/bash
#
# Convert files db-name.json to db-name-import.json.
#
# Note that this maintains the _id values for each document from
# export format to import format.
#
 
DATABASES=("logger_deanchen" "logger_oliver")
 
for DATABASE in ${DATABASES[@]}; do
  EXPORT_FILE=/data/backup/tmp/${DATABASE}.json
  IMPORT_FILE=/data/backup/tmp/${DATABASE}-import.json
 
  # Using cat is the only way to get the content with escaped quotes preserved.
  # cat "${EXPORT_FILE}" | \
  #  Remove the first line in the export.
  #  sed 's/{"total_rows":.*,"offset":.*,"rows":[//' | \
  #  Remove the last character of the line.
  #  sed 's/.$//' | \
  #  Remove unwanted stuff relating to the exported docs.
  #  sed 's/{"id":.*,"key".*,"value":.*,"doc"://' | \
  #  Remove revision info for the doc.
  #  sed 's/"_rev":"[^"]*",//' | \
  #  Terminate each line correctly.
  #  sed 's/},$/,/' | \
  #  Deal with the last line, which should have the closing brace.
  #  sed 's/}$//' 
 
  echo '{"docs":[' >> "${IMPORT_FILE}"
  cat "${EXPORT_FILE}" | \
    sed 's/{"total_rows":.*,"offset":.*,"rows":\[//' | \
	sed 's/.$//'  | \
    sed 's/{"id":.*,"key".*,"value":.*,"doc"://' | \
    sed 's/"_rev":"[^"]*",//' | \
    sed 's/},$/,/' | \
    sed 's/}$//' \
    >> "${IMPORT_FILE}"
  echo "}" >> "${IMPORT_FILE}"
done
