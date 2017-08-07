echo "the domain : $1"
ssh root@192.168.31.146 /usr/local/node/bin/node /root/work/tools/updateDns/updateDns.js domain $1;sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder; say DNS cache flushed；
ping $1
