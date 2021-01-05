//@flow
/* The utils for deploy */
import child_process		from 'child_process'
import fs					from 'fs'
import moment				from 'moment'

const log		= require('loglevel').getLogger('../deploy/utils.js')

export function test(){
	log.debug('test')
	return true
}

export async function deployToServer(
	/* The dir of project, where to execute : npm run build */
	projectPath		: string,
	/* The server to deploy */
	IPServer	: string,
	API_URL	: string,
	COUCHDB_URL		: string,
	COUCHDB_USER_NAME	: string,
	COUCHDB_USER_PASSWORD		: string,
) : Promise<boolean>{
	//{{{
	const timeBegin	= Date.now()
	const label		= 'utils -> deployToServer'
	log.debug('%s:',label)
	log.info('%s:begin build react project at %s',label,projectPath)
	if(!projectPath || !fs.existsSync(projectPath)){
		log.error('%s:projectPath bad:%s',label,projectPath)
		throw Error('wrong project path')
	}
	//the IP server host must be IP
	if(!/^\d+\.\d+\.\d+\.\d+$/.test(IPServer)){
		log.error('%s:the IPServer is bad:%s',label,IPServer)
		throw Error('wrong IPServer')
	}
	//the api host must be IP
	//if(!/^(http:\/\/)?(https:\/\/)?\w+$/.test(API_HOST)){
	if(!/^http.*$/.test(API_URL)){
		log.error('%s:the API_URL is bad:%s',label,API_URL)
		throw Error('wrong API_HOST')
	}
	//the couch db host
	if(!/^http.*$/.test(COUCHDB_URL)){
		log.error('%s:the COUCHDB_URL is bad:%s',label,COUCHDB_URL)
		throw Error('wrong COUCHDB_URL')
	}
	//couch user name
	if(!COUCHDB_USER_NAME || !COUCHDB_USER_PASSWORD){
		log.error('%s:the COUCHDB_USER_NAME or COUCHDB_USER_PASSWORD is bad:%s,%s',label,
			COUCHDB_USER_NAME,
			COUCHDB_USER_PASSWORD)
		throw Error('wrong COUCHDB_USER_PASSWORD or COUCHDB_USER_NAME')
	}

	const cmd	= `npm run build` 
	log.info('%s:the command to execute:%s',label,cmd)
	
	const ok	= await new Promise((resolve,reject) => {
		const cmd	= 
			`REACT_APP_API_URL=${API_URL} ` + 
			`REACT_APP_COUCHDB_URL=${COUCHDB_URL} ` + 
			`REACT_APP_COUCHDB_USER_NAME=${COUCHDB_USER_NAME} ` + 
			`REACT_APP_COUCHDB_USER_PASSWORD=${COUCHDB_USER_PASSWORD} ` + 
			`REACT_APP_VISIT_STATE=true ` + 
			'npm run build'
		log.debug('%s:the cmd to build:%s',label,cmd)
		const process	= child_process.exec(
			cmd,
			{
				cwd	: projectPath,
//				env	: {
//					test	: 'test',
////					REACT_APP_API_HOST	: API_HOST,
////					REACT_APP_API_PORT	: API_PORT,
////					REACT_APP_COUCHDB_HOST_B	: COUCHDB_HOST_B,
////					REACT_APP_COUCHDB_PORT		: COUCHDB_PORT,
////					REACT_APP_COUCHDB_USER_NAME	: COUCHDB_USER_NAME,
////					REACT_APP_COUCHDB_USER_PASSWORD	: COUCHDB_USER_PASSWORD,
//				},
				shell	: '/bin/bash',
				stdio	: [
						0,
						'pipe',
						'pipe',
					]
			}
		)
		process.stdout.on('data',data => {
			log.debug('%s:%s',label,data.toString())
		})
		process.stderr.on('data',data => {
			log.error('%s:%s',label,data.toString())
		})
		process.on('exit',code => {
			log.debug('%s:ok,exit with,%o',label,code)
			if(code !== 0){
				reject(Error('npm run build return with error:' + code))
			}else{
				resolve(true)
			}
		})
	})
	log.debug('%s:return with :%s',label,ok)
	log.info('%s:build finished, begin package the build dir',label)

	const cmdTar	= `tar -czf build.tar.gz ./build`
	const cmdTarCD	= projectPath
	log.info(
		'%s,to tar:%s, at %s',
		label,
		cmdTar,
		cmdTarCD)
	const stdout	= child_process.execSync(cmdTar,{cwd:cmdTarCD})
	log.info('%s:result of tar:%s',label,stdout)

//CLOSE, cuz server space is small, backup file will run out all the space of disk 
//	log.info('%s:to backup the projection dir on the server',label)
//	const timestamp	= moment().format('YYYYMMDDHHmm')
//	const cmdBackup	= `ssh -i ~/.ssh/deanchen.pem ec2-user@${IPServer} tar -czf /home/ec2-user/code/build.backup.tar.gz.${timestamp} /home/ec2-user/code/build`
//	log.info('%s:to backup on server with cmd:%s',label,cmdBackup)
//	const stdoutBackup	= child_process.execSync(cmdBackup)
//	log.info('%s:stdout backup:%s',label,stdoutBackup)
//	log.info('%s:backup finished',label)

	//to upload
	const cmdScp	= `scp ${projectPath}/build.tar.gz ec2-user@${IPServer}:/home/ec2-user/code/`
	log.info('%s:the cmd scp :%s',label,cmdScp)
	const stdoutScp	= child_process.execSync(cmdScp)
	log.debug('%s:the output of scp:%s',label,stdoutScp)
	log.info('%s:scp finished!',label)


	//To unpack the build file, overwrite the old version
	const cmdUnTar	= `ssh -i ~/.ssh/deanchen.pem ec2-user@${IPServer} tar -xzf  /home/ec2-user/code/build.tar.gz  --directory=/home/ec2-user/code/`
	log.info('%s:the cmd to un tar build dir:%s',label,cmdUnTar)
	const stdoutUnTar	= child_process.execSync(cmdUnTar)
	log.debug('%s:the stdout of un tar:%s',label,stdoutUnTar)
	log.info('%s:un tar finish',label)

	log.info('%s:deploy took time:%d ms',label,Date.now() - timeBegin)
	log.info('%s:finished! Please refresh the web page.',label)
	return true
	//}}}
}
