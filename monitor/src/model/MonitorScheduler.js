//@flow
/* To schedule the monitor , the interval, the place to save the data/log*/
import {Monitor}	from './Monitor.js'

const log		= require('loglevel').getLogger('../model/MonitorScheduler.js')

export class MonitorScheduler{
	monitors	: Array<Monitor>
	constructor() : MonitorScheduler{
		this.monitors	= []
		return this
	}

	config(options	: {
		IPs		: Array<string>,
		interval	: number,
		logDir	: string,
	}){
		//{{{
		const label		= 'MonitorScheduler -> config'
		log.debug('%s:',label)
		const {IPs,interval,logDir}	= options
		//to init every one monitor
		IPs.forEach(IP => {
			const monitor	= new Monitor()
			const fileName	= IP.replace(/\./g,'_')
			const logFilePath	= `${logDir}/${fileName}.log`
			monitor.config({
				IP,
				interval,
				logFilePath,
			})
			this.monitors.push(monitor)
		})
		//}}}
	}

	start(){
		//{{{
		const label		= 'MonitorScheduler -> start'
		log.debug('%s:',label)
		this.monitors.forEach(monitor => {
			monitor.start()
		})
		//}}}
	}
}
