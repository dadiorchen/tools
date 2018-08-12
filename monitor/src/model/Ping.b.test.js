//@flow

/* To test the ping in another way, do not exec the cmd really 
 * This is to simulate  the ping cmd on the aliyun server
 * */
import {Ping}		from './Ping.js'
import child_process		from 'child_process'


jest.mock('child_process')

const log		= require('loglevel').getLogger('../model/Ping.b.test.js')
let label

describe('Ping.b',() => {
	it(label = 'ping',() => {
		//{{{
		log.debug('%s:',label)
		child_process.execSync.mockReturnValue(
`PING 52.194.22.113 (52.194.22.113) 56(84) bytes of data.
64 bytes from 52.194.22.113: icmp_seq=1 ttl=227 time=274 ms

--- 52.194.22.113 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 274.477/274.477/274.477/0.000 ms`)

		const ping	= new Ping()
		let result		= ping.ping('127.0.0.1')
		expect(result).toBeGreaterThanOrEqual(274)

		child_process.execSync.mockReturnValue(
`PING 52.194.22.113 (52.194.22.113) 56(84) bytes of data.

--- 52.194.22.113 ping statistics ---
1 packets transmitted, 0 received, 100% packet loss, time 0ms`)
		//fail cuz bad IP
		result		= ping.ping('127.0.8.1')
		expect(result).toBeGreaterThanOrEqual(-1)
		//}}}
	})
})


