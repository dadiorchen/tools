#!/bin/bash
# To run chrome with SSL security allow
rm -rf /tmp/foo
#/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp/foo --allow-running-insecure-content --reduce-security-for-testing --unsafely-treat-insecure-origin-as-secure=http://192.168.31.180,http://midinote.me,https://192.168.31.180,http://midinote.me
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp/foo --allow-running-insecure-content --reduce-security-for-testing --unsafely-treat-insecure-origin-as-secure=https://www.testserviceworker.com
