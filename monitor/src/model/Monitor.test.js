//@flow
import * as fs			from 'fs'
import {Ping}			from './Ping.js'
import {Monitor}		from './Monitor.js'

jest.mock('fs')
jest.mock('./Ping')

const log		= require('loglevel').getLogger('../model/Monitor.test.js')
log.setLevel('trace')
require('loglevel').getLogger('../model/Monitor.js').setLevel('trace')
let label

describe('Monitor',() => {
	it(label = 'monitor',() => {
		//{{{
		log.debug('%s:',label)
		const monitor	= new Monitor()
		//mock fs to return that: file do not exist, then, monitor will create the file
		fs.existsSync.mockReturnValueOnce(false)
		fs.appendFileSync.mockReturnValueOnce(true)
		monitor.config({
			IP			: '127.0.0.1',
			interval	: 1,
			logFilePath		: '/the/path/do/not/exist.log',
		})

		jest.useFakeTimers()

		//Mock Ping
		//$FlowFixMe
		Ping.mockImplementation(() => ({
			ping	: () => -1,
		}))
		monitor.start()
		//a beat
		jest.runOnlyPendingTimers()

		//
		//}}}
	})
})
