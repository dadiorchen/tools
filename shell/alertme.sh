#!/bin/bash
# To make some notification on Mac
# USEAGE:  alertme "the message"
# Use senarior: [some command];alertme "Finished"
/usr/bin/osascript -e "display notification \"$1\" with title \"Hey\" sound name \"Hero\""
