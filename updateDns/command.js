//----------------------- config ---------------------------------
var CONFIG ={
	BACKUP_DIR : '/root/backup',
}
console.log(`load command module with config:`,CONFIG);

/*
 * ping domain through tokyo server,and get the ip
 * */
function getTokyoIp(domain){
	console.info(`try to get ip of ${domain}...`);
	var stdout = require('child_process').execSync(`ssh -i ~/.ssh/deanchen.pem ec2-user@13.112.109.157  ping -c 1 ${domain}`);
	console.log(stdout);
	var ipText = /PING \S+ \((\d+\.\d+\.\d+\.\d+)\)/g.exec(stdout);
	if(ipText){
		console.log('find the ip : ',ipText[1]);
	}else{
		console.error('can not find the ip text...');
	}
	console.log('execute pint finished!');
	return ipText[1];
}

function restartBind() {
	console.info('try to restart bind...');
	var stdout = require('child_process').execSync('/etc/init.d/named restart');
	console.log(stdout);
	console.log('execute bind restart finished!');
}

/**
 * back up the file to backup dir,with file name ( /xxx/xxx/xxx.201701011710)
 * throw error if file not exiest
 * */
function backupFile(pathOfFile ) {
	require('fs').statSync(pathOfFile);
	var backupDir = `${CONFIG.BACKUP_DIR}/${pathOfFile.slice(0,pathOfFile.lastIndexOf('/'))}`;
	var fileName = pathOfFile.slice(pathOfFile.lastIndexOf('/')+1);
	console.info(`the backup dir :${backupDir} , the file name :${fileName}`);
	//make dir
	var process = require('child_process');
	var stdout = process.execSync(`mkdir -p ${backupDir}`);
	console.log(stdout);
	//cp file
	stdout = process.execSync(`cp ${pathOfFile} ${backupDir}/${fileName}.\`date +%Y%m%d%H%M\`;ls -l ${backupDir}/${fileName}.\`date +%Y%m%d%H%M\``);
	console.log(stdout);
}


var args = process && process.argv && process.argv.slice(2);
if(args){
	if(args.length == 1 && args[0] === 'restartBind'){
		restartBind();
	}else if(args.length == 2 && args[0] === 'ping'){
		getTokyoIp(args[1]);		
	}else if(args.length == 2 && args[0] === 'backup'){
		backupFile(args[1]);
	}
}

exports.getTokyoIp = getTokyoIp;
exports.backupFile = backupFile;
exports.restartBind = restartBind;
