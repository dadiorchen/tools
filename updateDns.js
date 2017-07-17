var NAMED_DIR = '/var/named/';
var ETC_CONFIG_FILE_PATH = '/etc/named.conf';
var command = require('./command.js');
var MODE = {
	TEST : 'TEST',
	RUN : 'RUN',
}
var fs = require('fs');

console.info(`start script with config: \n NAMED_DIR :${NAMED_DIR} \n ETC_CONFIG_FILE_PATH : ${ETC_CONFIG_FILE_PATH} `);
//var domain = '6-edge-chat.facebook.com';
//load command


var mode;
var domain;
var args = process && process.argv && process.argv.slice(2);
if(args){
	if(args.length == 2 && args[0] === 'domainTest'){
		mode = MODE.TEST;
		domain = args[1];
	}else if(args.length == 2 && args[0] === 'domain'){
		mode = MODE.RUN;
		domain = args[1];
	}
}
if(!mode || !domain){
	throw new Error('usage : node updateDns.js (domain|domainTest) www.xxx.com');
}

//get ip
var ip = command.getTokyoIp(domain);
console.log(`get tokyo ip of ${domain} : ${ip}`);
if(!/^\d+\.\d+\.\d+\.\d+$/g.test(ip)){
	throw new Error(`wrong ip :${ip}`);
}


console.info(`to update domain:${domain} to ip : ${ip}`);

if(domain.lastIndexOf('.') <= 0){
	console.error(`get error index of main domain :${indexOfMainDomain} `);
	throw new Error();
}
var indexOfMainDomain = domain.lastIndexOf('.',domain.lastIndexOf('.')-1);
var mainDomain = domain.substring(indexOfMainDomain + 1);
console.info(`parse the mainDomain :${mainDomain}`);
//check the main domain
if(!/^((?!\.).)+\.((?!\.).)+$/g.test(mainDomain)){
	console.error(`bad format of main domain :${mainDomain}`);
	throw new Error();
}

var subDomain = '';
if(indexOfMainDomain <= 0){
	subDomain = '@';
}else{
	subDomain = domain.substring(0,indexOfMainDomain);
}
console.info(`parse the sub domain :${subDomain}`);

var fs = require('fs');
var dirs = fs.readdirSync(NAMED_DIR);
console.info('dir of named :',dirs);

//check if the domain file already exist
var mainDomainFileName = 'named.' + mainDomain;
var mainDomainFileExiest = false;
dirs.forEach( n => {
	if(n === mainDomainFileName){
		mainDomainFileExiest = true;
	}
});


if(mainDomainFileExiest){
	console.info(`mainDomainFile exiest , modify it...`);
	//read the file
	var namedFileLines = fs.readFileSync(NAMED_DIR + mainDomainFileName,'ascii').split('\n');
	console.info('the named file :',namedFileLines);
	//check if the dns line already exiest
	var subDomainLineExiest = false;
	var modifiedFileLines = [];
	namedfileLines = namedFileLines.map(function(line){
		if(subDomain === '@'){
			if(line.startsWith('@') && /^\S+\s+IN\s+A\s+\d+\.\d+\.\d+\.\d+$/g.test(line)){ 
				subDomainLineExiest = true;
				line = `@\tIN\tA\t${ip}`;
			}
		}else if(subDomain === 'www'){
			if(line.startsWith('@') && /^\S+\s+IN\s+A\s+\d+\.\d+\.\d+\.\d+$/g.test(line)){ 
				subDomainLineExiest = true;
				line = `@\tIN\tA\t${ip}`;
			}else if(line.startsWith('www') && /^\S+\s+IN\s+A\s+\d+\.\d+\.\d+\.\d+$/g.test(line)){ 
				subDomainLineExiest = true;
				line = `www\tIN\tA\t${ip}`;
			}
		}else if(line.startsWith(subDomain) && /^\S+\s+IN\s+A\s+\d+\.\d+\.\d+\.\d+$/g.test(line)){
			console.info(`the sub doman line exiest! , update it : ${line}`);
			subDomainLineExiest = true;
			line = `${subDomain}\tIN\tA\t${ip}`;
		}
		modifiedFileLines.push(line);
	});
	if(!subDomainLineExiest ){
		modifiedFileLines.push(`${subDomain}\tIN\tA\t${ip}`);
	}
	modifiedFileLines.push('');
	console.info(`the modifed named file:`,modifiedFileLines);
	if(mode === MODE.RUN){
		console.info(`first , backup the origin named config file`);
		command.backupFile(NAMED_DIR + mainDomainFileName);
		console.info(`then , overwrite (write) named config file`);
		fs.writeFileSync(NAMED_DIR + mainDomainFileName,modifiedFileLines.join('\n'));
	}
}else{
	console.info(`main domain file not exiest , create one...`);
	//update the etc config file
	var etcConfigFileContent = fs.readFileSync(ETC_CONFIG_FILE_PATH,'ascii');
	if(etcConfigFileContent.indexOf(mainDomain) >= 0){
		console.error('there is error , no named file , but found domain in etc config file');
		throw new Error();
	}

	var  fileTemplate = `$TTL 600
@       IN SOA  @ rname.invalid. (
		                                        0       ; serial
		                                        1D      ; refresh
		                                        1H      ; retry
		                                        1W      ; expire
		                                        3H )    ; minimum
@       IN      NS      MiWiFi-R3-srv. 
`;
	var  fileContent = `${fileTemplate}\n${subDomain}\tIN\tA\t${ip}\n`;
	if(subDomain == 'www' || subDomain === 'nowww'){
		fileContent += `@\tIN\tA\t${ip}\n`;
	}
	console.info(`the new name file :\n${fileContent}`);
	
	//add lines to etc config file
	etcConfigFileContent += 
`\nzone "${mainDomain}" IN {
	        type master;
	        file "named.${mainDomain}";
	        allow-update { none;};
};`;

	console.info('the modified etc conifg file',etcConfigFileContent);
	if(mode === MODE.RUN){
		console.info(`first , backup the origin etc config file`);
		command.backupFile(ETC_CONFIG_FILE_PATH);
		console.info(`then , wirte new date to etc file`);
		fs.writeFileSync(ETC_CONFIG_FILE_PATH,etcConfigFileContent);
		console.info(`then , create (write) a new named config file`);
		fs.writeFileSync(NAMED_DIR + mainDomainFileName,fileContent);
	}
}

if(mode === MODE.RUN){
	console.log(`last ,restart named service`);
	command.restartBind();
}



console.log(`${mode == MODE.TEST ? 'test mode,the status:':'run mode,finsihed update:'}
the domain:	${domain}
the ip:		${ip}
mainDomainFileName : ${mainDomainFileName}
mainDomainFileExiest : ${mainDomainFileExiest} (true:modify the exiest file;false:create a new one)
subDomainLineExiest : ${subDomainLineExiest} (true: modify the same line in file;false:append a new line )
`);
