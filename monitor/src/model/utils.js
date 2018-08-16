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
	/* The total lines/points for the stat */
	count	: number,
}=>{
	//{{{
	const label		= 'utils -> stat'
	log.debug('%s:',label)
	const result	= {
		min		: Number.POSITIVE_INFINITY,
		max		: Number.NEGATIVE_INFINITY,
		avg		: 0,
		lost	: 0,
		IP		: '',
		count	: 0,
		countFail	: 0,
	}
	let total	= 0
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
				result.countFail++
			}else{
				total	+= delay
				if(result.min > delay){
					result.min	= delay
				}
				if(result.max < delay){
					result.max	= delay
				}
			}
			result.count++
		}else{
			throw new Error(`${label}:the line is bad:${line}`)
		}
	})
	result.avg	= total / (result.count - result.countFail)
	result.lost	= result.countFail / result.count

	return result
	//}}}
}
