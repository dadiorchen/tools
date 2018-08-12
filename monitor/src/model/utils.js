//@flow
/* utilities function for monitor */

const log		= require('loglevel').getLogger('../model/utils.js')
/* Given the IP record lines, return stat
 *
 * */
export const stat	= (lines : Array<string>) : {
	min		: number,
	max		: number,
	avg		: number,
	lost	: number,
	IP		: string,
}=>{
	//{{{
	const label		= 'utils -> stat'
	log.debug('%s:',label)
	const result	= {
		min		: 0,
		max		: Number.POSITIVE_INFINITY,
		avg		: 0,
		lost	: 0,
		IP		: '',
	}
	let total	= 0
	let count	= 0
	let countFail	= 0
	//201808121536    52.194.22.113   317
	lines.forEach(line => {
		//test
		const matcher	= line.match(/^(\d{12})\s+(\d+\.+\d+\.\d+\.\d+)\s+([0-9-]{1,})$/)
		if(matcher){
			log.trace('%s:the line matched,%o',label,matcher)
			const timeString	= matcher[1]
			const IPString		= matcher[2]
			const delayString	= matcher[3]
			result.IP		= IPString
			const delay		= parseInt(delayString)
			if(delay < 0){
				countFail++
			}else{
				total	+= delay
				if(result.min > delay){
					result.min	= delay
				}
				if(result.max < delay){
					result.max	= delay
				}
			}
			count++
		}else{
			throw new Error(`${label}:the line is bad:${line}`)
		}
	})
	result.avg	= total / count
	result.lost	= countFail / count

	return result
	//}}}
}
