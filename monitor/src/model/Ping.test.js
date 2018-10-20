//@flow
/* To test ping */

import {Ping}		from './Ping.js'

const log			= require('loglevel').getLogger('../model/Ping.test.js')
require('loglevel').getLogger('../model/Ping.js').setLevel('trace')
let label


describe('Ping',() => {
	it(label = 'ping',() => {
		//{{{
		log.debug('%s:',label)
		const ping	= new Ping()
		let result		= ping.ping('127.0.0.1')
		expect(result).toBeGreaterThanOrEqual(0)

		//fail cuz bad IP
		result		= ping.ping('127.0.8.1')
		expect(result).toBeGreaterThanOrEqual(-1)
		//}}}
	})
})
