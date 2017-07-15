var NAMED_DIR = '/var/named/';
console.info(`start script with config: \n NAMED_DIR :${NAMED_DIR} \n `);
var domain = '6-edge-chat.facebook.com';
var ip = '10.10.10.10'
console.info(`to update domain:${domain} to ip : ${ip}`);

var indexOfMainDomain = domain.lastIndexOf('.',domain.lastIndexOf('.')-1);
if(indexOfMainDomain <= 0){
	console.error(`get error index of main domain :${indexOfMainDomain} `);
	throw new Error();
}
var mainDomain = domain.substring(indexOfMainDomain + 1);
console.info(`parse the mainDomain :${mainDomain}`);
//check the main domain
if(!/^((?!\.).)+\.((?!\.).)+$/g.test(mainDomain)){
	console.error(`bad format of main domain :${mainDomain}`);
	throw new Error();
}

var subDomain = domain.substring(0,indexOfMainDomain);
console.info(`parse the sub domain :${subDomain}`);

var fs = require('fs');
var dirs = fs.readdirSync('/var/named/');
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
		if(line.startsWith(subDomain) && /^\S+\s+A\s+\d+\.\d+\.\d+\.\d+$/g.test(line)){
			console.info(`the sub doman line exiest! , update it : ${line}`);
			subDomainLineExiest = true;
			line = `${subDomain}\tA\t${ip}`;
		}
		modifiedFileLines.push(line);
	});
	if(!subDomainLineExiest ){
		modifiedFileLines.push(`${subDomain}\t\A\t${ip}`);
	}
	console.info(`the modifed named file:`,modifiedFileLines);
}else{
	console.info(`main domain file not exiest , create one...`);
}

