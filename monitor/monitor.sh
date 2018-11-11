#!/bin/bash
LOG_FILE_JVM="/root/app/log/monitor_jvm.log"
echo "the log file for jvm :$LOG_FILE_JVM"
echo "timestamp:: `date`" >> $LOG_FILE_JVM;
JVM_PORT=`netstat -anp | grep 8080 | grep LISTEN | awk '{print $7}' | cut -f 1 -d '/'`;
echo "jvm port : $JVM_PORT";
/usr/local/jdk1.8.0_91/bin/jstat -gcutil $JVM_PORT >> $LOG_FILE_JVM;

LOG_FILE_TOP="/root/app/log/monitor_top.log"
echo "the log file for top :$LOG_FILE_TOP"
top -b -n 1 -d 10  >> $LOG_FILE_TOP;
echo "finish top and jvm record";
