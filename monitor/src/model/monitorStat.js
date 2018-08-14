//@flow
/* The cmd to stat the ping record log file */
import * as loglevel	from 'loglevel'
import fs		from 'fs'
loglevel.setDefaultLevel('trace')

const log		= require('loglevel').getLogger('../model/monitorStat.js')
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

const linesFile	= fs.readFileSync(value).toString().split('\n')

const result	= utils.stat(linesFile)
//BACK : to print the result of stat, then test the script
