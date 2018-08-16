//@flow
import * as utils		from './utils.js'
const log		= require('loglevel').getLogger('../model/utils.test.js')
log.setLevel('trace')
let label

describe('utils',() => {
	it(label = 'stat',() => {
		//{{{
		log.debug('%s:',label)
		const lines	= 
`201808121535    52.194.22.113   201
201808121535    52.194.22.113   202
201808121535    52.194.22.113   258
201808121535    52.194.22.113   316
201808121535    52.194.22.113   209
201808121535    52.194.22.113   216
201808121535    52.194.22.113   -1
201808121535    52.194.22.113   288
201808121536    52.194.22.113   317
201808121536    52.194.22.113   310
201808121536    52.194.22.113   520
201808121536    52.194.22.113   312`.split('\n')
		
		const result	= utils.stat(lines)
		expect(result.min).toBe(201)
		expect(result.max).toBe(520)
		log.debug('%s:the result:%o',label,result)


		//}}}
	})

	it(label = 'statMain',() => {
		//{{{
		log.debug('%s:',label)
		process.argv	= [
			'node',
			'monitorStat.js',
			'logFile=/path/to/no/where',
		]
		jest.doMock('fs',() => ({
			existsSync	: () => true,
			readFileSync	: () => (
`201808121535    52.194.22.113   201
201808121535    52.194.22.113   202
201808121535    52.194.22.113   258
201808121535    52.194.22.113   316
201808121535    52.194.22.113   209
201808121535    52.194.22.113   216
201808121535    52.194.22.113   -1
201808121535    52.194.22.113   288
201808121536    52.194.22.113   317
201808121536    52.194.22.113   310
201808121536    52.194.22.113   520
201808121536    52.194.22.113   312`
			),
		}))
		require('./monitorStat.js')
		jest.dontMock('fs')
		//}}}
	})
})
