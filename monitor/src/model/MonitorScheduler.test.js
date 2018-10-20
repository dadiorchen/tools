//@flow
import fs		from 'fs'
import {Ping}	from './Ping.js'

import {MonitorScheduler}		from './MonitorScheduler.js'

const log		= require('loglevel').getLogger('../model/MonitorScheduler.test.js')
require('loglevel').getLogger('../model/Monitor.js').setLevel('trace')
let label
jest.mock('fs')
jest.mock('./Ping.js')

describe('MonitorScheduler',() => {
	it(label = 'schedule',() => {
		//{{{
		log.debug('%s:',label)
		const monitorScheduler	= new MonitorScheduler()
		//To test the log dir do not exist , and try to create one
		monitorScheduler.config({
			IPs		: ['127.0.0.1','192.168.31.180'],
			interval	: 1000,
			logDir		: '/path/not/exist',
		})
		expect(monitorScheduler.monitors).toHaveLength(2)

		//Mock Ping
		//$FlowFixMe
		Ping.mockImplementation(() => ({
			ping	: () => -1
		}))
		jest.useFakeTimers()
		monitorScheduler.start()
		jest.runOnlyPendingTimers()

		//}}}
	})
})
