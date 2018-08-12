//@flow
/* To ping the given server, record the result to file, 
 * for future stat */
import moment	from 'moment'
import * as fs	from 'fs'
import {Ping}	from './Ping.js'

const log		= require('loglevel').getLogger('../model/Monitor.js')

export class Monitor{
	timerStub	: any
	IP			: string
	interval	: number
	logFilePath	: string
	constructor() : Monitor{
		this.interval	= 1000
		return this
	}

	/* To config the monitor, like ping interval and so on */
	config(options : {
		IP		: string,
		interval		: number, //ms
		logFilePath		: string,
	}){
		//{{{
		const label		= 'Monitor -> config'
		log.debug('%s:',label)
		//check if the file exist
		const {IP,interval,logFilePath}	= options
		if(!/\d+\.\d+\.\d+\.\d+/.test(IP)){
			throw Error(`invalid IP:${IP}`)
		}
		this.IP		= IP

		if(!/\d+/.test(interval + '')){
			throw Error(`invlalid interval:${interval}`)
		}
		this.interval	= interval
		
		if(fs.existsSync(logFilePath)){
			log.debug('%s:OK log file exist',label)
		}else{
			log.debug('%s:log file not exist, create',label)
			fs.appendFileSync(logFilePath,'')
		}
		this.logFilePath	= logFilePath
		//}}}
	}

	/* To start the monitor */
	start(){
		//{{{
		const label		= 'Monitor -> start'
		log.debug('%s:',label)
		this.timerStub	= setInterval(() => {
			this.beat()
		},this.interval)
		//}}}
	}

	/* A beat */
	beat(){
		//{{{
		const label		= 'Monitor -> beat'
		log.debug('%s:',label)
		const ping		= new Ping()
		const result	= ping.ping(this.IP)
		log.debug('%s:get ping result:%o',label,result)
		//to write to file : timestamp	IP	result
		const line		= `${moment().format('YYYYMMDDHHmm')}\t${this.IP}\t${result}\n`
		log.debug('%s:to write:%s',label,line)
		fs.appendFileSync(this.logFilePath,line)
		
		//}}}
	}

	/* To stop the monitor */
	stop(){
		//{{{
		const label		= 'Monitor -> stop'
		log.debug('%s:',label)
		clearInterval(this.timerStub)
		//}}}
	}
}
