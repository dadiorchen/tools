//@flow
/* The cmd to stat the ping record log file */
import * as loglevel	from 'loglevel'
import fs		from 'fs'
console.trace	= console.debug
loglevel.setDefaultLevel('trace')

const log		= require('loglevel').getLogger('../model/monitorStat.js')
log.setLevel('trace')
const utils		= require('./utils.js')
const label		= 'main'
const usage		= `USAGE:
npm run monitorStat -- logFile=/path/to/log/file.log`

log.info('begin stat...')
const args	= process.argv.slice(2)
log.debug('%s: with args :%o',label,args)

log.debug('%s:analysis the args',label)

if(args.length !== 1){
	throw Error(usage)
}

const [name,value]	= args[0].split('=')

if(name !== 'logFile'){
	throw Error(usage)
}

log.debug('%s:to read file:%s',label,value)

const filePath	= value
if(!fs.existsSync(filePath)){
	throw Error('file do not exist:'+filePath)
}
const linesFile	= fs.readFileSync(value).toString().split('\n')
log.debug('%s:read file lines:%d',label,linesFile.length)

const result	= utils.stat(linesFile)
log.info('%s:the result of stat:%o',label,result)
log.warn('%s:the result of stat:%o',label,result)
