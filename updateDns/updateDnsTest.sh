echo "the domain : $1"
ssh root@192.168.31.146 /usr/local/node/bin/node /root/work/tools/updateDns/updateDns.js domainTest $1
ping $1
