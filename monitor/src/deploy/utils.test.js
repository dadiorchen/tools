//@flow
import * as utils	from './utils.js'

const log		= require('loglevel').getLogger('../deploy/utils.test.js')
log.setLevel('trace')
require('loglevel').getLogger('../deploy/utils.js').setLevel('trace')
let label

describe('utils',() => {
	/* Test deploy to server on my mac, skip cuz too slow */
	it.skip(label = 'deployToServer',async () => {
		//{{{
		log.debug('%s:',label)
		const ok	= await utils.deployToServer(
			'/Users/deanchen/logger/',
			'52.194.22.113',
			'52.194.22.113',
			'3002',
			'52.194.22.113',
			'5984',
			'midinoteAdmin',
			'Discuit1145'
		)
		expect(ok).toBe(true)
		//}}}
	},1000*60*10)

	/* To test the command tool, simulating CLI */
	it(label = 'testMain',() => {
		//{{{
		log.debug('%s:',label)
		//Mock the deploy method
		const mockDeployToServer	= jest.fn()
		jest.doMock('./utils.js',() => {
			return {
				test	: () => log.debug('%s:mock',label),
				deployToServer	: mockDeployToServer,
			}
		})
		//Override the parameters, to simulate the CLI
		process.argv	= [
			'node',
			'main.js',
			'projectPath=/usr/local',
			'IPServer=1',
			'API_HOST=2',
			'API_PORT=3',
			'COUCHDB_HOST_B=4',
			'COUCHDB_PORT=5',
			'COUCHDB_USER_NAME=username',
			'COUCHDB_USER_PASSWORD=123456',
		]
		require('./main.js')
		expect(mockDeployToServer).toHaveBeenCalledWith(
			'/usr/local',
			'1',
			'2',
			'3',
			'4',
			'5',
			'username',
			'123456'
		)
		
		//Remove the mock
		jest.dontMock('./utils.js')
		
		
		//}}}
	})
})
