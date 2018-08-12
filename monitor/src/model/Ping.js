//@flow
/* The object to exec ping command, return output result 
 * The ping object is sample: given a target, ping one time, get result:
 * 		-1	: fail
 * 		>0	: delay in ms
 * */
import * as child_process		from 'child_process'

const log		= require('loglevel').getLogger('../model/Ping.js')

export class Ping {

	/* To ping the IP, get result in number 
	 * RESULT:
	 *	-1	: fail
	 *  >0	: delay in ms
	 *
sample:
PING 127.0.0.1 (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.044 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 0.044/0.044/0.044/0.000 ms
	 * */
	ping(IP : string) : number{
		//{{{
		const label		= 'Ping -> ping'
		log.debug('%s:',label)
		let result
		try{
			result	= child_process.execSync(`ping ${IP} -c 1 -t 3`)
		}catch(e){
			log.error('%s:ping fail:%s',label,e)
			return -1
		}
		//To analyses the result
		log.debug('%s:get result:',label,result)
		if(result.indexOf('0.0% packet loss') > 0 ){
			log.debug('%s:sucess, extract the delay time')
			const matcher	= result.toString().match(
				/min\/avg\/max\/stddev = [0-9.]+\/([0-9.]+)\/[0-9.]+\/[0-9.]+ ms/m
			)
			if(matcher){
				log.trace('%s:get match : %o',label,matcher)
				const avgString	= matcher[1]
				log.debug(
					'%s:get avg string:%s',
					label,
					avgString)
				const avg	= parseInt(avgString)
				return avg
			}else{
				throw Error('impossible')
			}
		}else if(result.indexOf('100.0% packet loss') > 0){
			log.debug('%s:fail')
			return -1
		}else{
			throw Error('impossible')
		}


		//}}}
	}
}
