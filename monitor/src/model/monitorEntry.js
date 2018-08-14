//@flow
/* The entry of monitor, the main function */
import * as loglevel	from 'loglevel'
loglevel.setDefaultLevel('trace')
//Can not use import here, cuz if so, the loglevel can not set default log level
const {MonitorScheduler}	= require('./MonitorScheduler.js')

const log		= require('loglevel').getLogger('../model/monitorEntry.js')
const label		= 'main'
const usage		= 
`USAGE:
	node monitorEntry.js ips=xxxx,xxxx interval=1000 logDir=/tmp/dir/
`

log.info('%s:mointor staring...',label)


const args	= process.argv.slice(2)
log.debug('%s: with args :%o',label,args)

log.debug('%s:analysis the args',label)

const options	= {}
args.forEach(arg => {
	const [name,value]	= arg.split('=')
	log.debug(
		'%s:the name:%s, value:%s',
		label,
		name,
		value)
	
	//The options for monitor scheduler 
	switch(name){
		case 'ips':{
			options.IPs	= value.split(',')
			break
		}
		case 'interval':{
			options.interval	= parseInt(value)
			break
		}
		case 'logDir': {
			options.logDir	= value
			break
		}
		default : throw Error('the parameter is bad:' + name + ' \n' + usage)
	}
})

if(!options.IPs || !options.interval || !options.logDir){
	throw Error('the command lost some parameters,' + usage)
}

log.debug(
	'%s:the options for monitor:%o',
	label,
	options)

const monitorScheduler	= new MonitorScheduler()
monitorScheduler.config(options)
monitorScheduler.start()

