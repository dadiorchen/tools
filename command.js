/*
 * ping domain through tokyo server,and get the ip
 * */
function getTokyoIp(domain){
	console.info(`try to get ip of ${domain}...`);
	require('child_process').exec(`ssh -i ~/.ssh/deanchen.pem ec2-user@13.112.109.157  ping -c 1 ${domain}`,function(err,stdout,stderr){
		if(err){
			console.error('execute cmd failure!',stderr);
			throw new Error();
		}else{
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
	});
	}

function restartBind() {
	console.info('try to restart bind...');
	require('child_process').exec('/etc/init.d/named restart',function(err,stdout,stderr){
		if(err){
			console.error('execute cmd failure!',stderr);
			throw new Error();
		}else{
			console.log(stdout);
			console.log('execute bind restart finished!');
		}
	});
}

var args = process && process.argv && process.argv.slice(2);
if(args){
	if(args.length == 1 && args[0] === 'restartBind'){
		restartBind();
	}else if(args.length == 2 && args[0] === 'ping'){
		getTokyoIp(args[1]);		
	}
}
