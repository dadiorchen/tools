/* This tool scan the given path , replace the text
 * This tool is because the problem of Midinote throw way is bad, so , scan all the source file , replace the problem lines , and insert some require
 * I think this tool can be re-used in future for some things like:
 * 		* scan all the source js file
 * 		* change some thing 
 * 		* save
 *
 *
 * */
const fs		= require('fs')

/*
 * return : 
 * {
 * 		foundUtils	: boolean,
 * 		foundFirstRequire	: number
 * 		changed		: boolean,
 * 		lines		: Array<lines>
 * 	}*/
function doUtilsRequire(lines,deep){
	let foundUtils	= false
	let foundFirstRequire	= -1
	let changed		= false
	lines.forEach((line,i) => {
		if(line.match(/^const.+=\s+require\(\S+\)\s*$/g)){
			if(foundFirstRequire < 0 ){
				foundFirstRequire	= i
				console.log('foud firs input ,line:',line)
			}
		}
		if(line.match(/^const\s+\{utils\}\s+=\s+require\(\S+Utils\.js\'\)/) || line.match(/import\s+\{utils.*from.*utils\/Utils\.js/)){
			foundUtils	= true
			console.log('found utils ,line:',line)
		}
	})

	if(!foundUtils ){
		if(foundFirstRequire >= 0 ){
			console.log('to change ')
			const utilLine	= `const {utils}	= require('.${Array.from(new Array(deep)).fill('/..').join('')}/utils/Utils.js')`
			lines	= [...lines.slice(0,foundFirstRequire + 1),utilLine,...lines.slice(foundFirstRequire+ 1)]
			changed			= true
		}else{
			console.warn('not found utils,and not found the first require, so cancel the util line insert')
		}
	}
	return {
		foundUtils,
		foundFirstRequire,
		changed,
		lines,
	}
}

function replaceThrow(line) {
	const match	= line.match(/throw new Error\((\S+)\)/)
	if(match){
		//console.log('match:',match)
		const newLine	= line.replace(/throw\s+new\s+Error\((\S+)\)/,'utils.errorThrow($1)')
		console.log('new line:',newLine)
		return newLine
	}else{
		return line
	}
}

function replaceWrapper(line) {
	const match	= line.match(/e\.stack\s+\+=\s+Error\(\)\.stack/)
	if(match){
		//console.log('match:',match)
		const newLine	= line.replace(/e\.stack\s+\+=\s+Error\(\)\.stack/,'e	= utils.errorWrapper(e)')
		console.log('new line:',newLine)
		return newLine
	}else{
		return line
	}
}

function doJsFile(lines,depth){
	let changed		= false
	lines			= lines.map(line => {
		const newLine	= replaceWrapper(replaceThrow(line))
		if(newLine !== line){
			changed	= true 
		}
		return newLine
	})
	if(changed){
		//try to deal with utils require
		let result		= doUtilsRequire(lines,depth)
		if(result.changed){
			lines	= result.lines
		}
	}
	return {
		changed,
		lines
	}
}

/*
 * execute: true: change file really, false: just test */
function scanDir(path,execute){
	//html/index.js
	let counterFile		= 0
	let counterDir		= 0
	let counterJs		= 0
	let filesChanged	= []
	function recurse(path,level){
		counterDir++
		const dir		= fs.readdirSync(path)
		dir.forEach(d => {
			const pathFull	= `${path}/${d}`
			console.log('The full path:',pathFull)
			const state		= fs.statSync(pathFull)
			if(state.isDirectory()){
				console.log('Check dir:',pathFull)
				recurse(pathFull,level + 1)
			}else if(state.isFile()){
				counterFile++
				if(pathFull.endsWith('.js') && !pathFull.endsWith('min.js') && !pathFull.endsWith('test.js') && !pathFull.endsWith('Utils.js')){
					counterJs++
					console.log('read js file,%s,with depth:%s',pathFull,level)
					const fileContent		= fs.readFileSync(pathFull)
					const lines				= fileContent.toString().split('\n')
					const result			= doJsFile(lines,level)
					if(result.changed === true){
						filesChanged.push(pathFull)
						if(execute) fs.writeFileSync(pathFull,result.lines.join('\n'))
					}else{
						console.log('js file do not change,skip')
					}

				}else{
					console.log('skip file:',pathFull)
				}
			}
		})
	}
	recurse(path,0)
	console.warn('changed files:\n',filesChanged)
	console.log('Scan file:',counterFile)
	console.log('Scan dir:',counterDir)
	console.log('Scan js:',counterJs)
}

module.exports = {
	doUtilsRequire,
	replaceThrow,
	doJsFile,
	scanDir,
	replaceWrapper,
}


