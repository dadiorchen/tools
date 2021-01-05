//@flow
/* The entry of deploy script */
/* The main entry /command entry of deploy */

import * as loglevel	from 'loglevel'
loglevel.setDefaultLevel('trace')

const log		= require('loglevel').getLogger('../deploy/mina.js')
const label		= 'main'
const usage		= 
`USAGE:
	npm run deploy -- IPServer=[ip]
`
const utils		= require('./utils.js')

log.info('%s:begin deploy...',label)

const args	= process.argv.slice(2)
log.debug('%s:with args:%o',label,args)

utils.test()

/* Check the arguments, it is :
    * projectPath	: string
	* IPServer	: IP
	* API_URL	: string
	* COUCHDB_URL		: string,
	* COUCHDB_USER_NAME	: string,
	* COUCHDB_USER_PASSWORD		: string,
*/

//Parse the arguments, change to Object key-value pairs
const argsMap	= {}
args.forEach(arg => {
	const [name,value]	= arg.split('=')
	argsMap[name]	= value
})

log.debug('%s: the map of args:%o',label,argsMap)

log.info('%s:invoke to deploy',label)
utils.deployToServer(
	argsMap['projectPath'],
	argsMap['IPServer'],
	argsMap['API_URL'],
	argsMap['COUCHDB_URL'],
	argsMap['COUCHDB_USER_NAME'],
	argsMap['COUCHDB_USER_PASSWORD'],
)
