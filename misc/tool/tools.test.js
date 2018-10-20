const fs	= require('fs')
const {replaceWrapper,scanDir,doUtilsRequire,replaceThrow,doJsFile}		= require('./tools.js')

describe('Test',() => {
	it.skip('Test',() => {
		const path	= '/Users/deanchen/temp/src'
		//const path	= '/Users/deanchen/logger/src'
		scanDir(path,true)

	})

	it('TestJs',() => {
		const path	= '/Users/deanchen/temp/src/index.js'
		const fileContent		= fs.readFileSync(path)
		const lines				= fileContent.toString().split('\n')
//		lines	= lines.map(line => {
//		})
		fs.writeFileSync(path + '.bak',lines.join('\n'))
	})

	it('TestLine',() => {
		const line	= '            if(!await this.initI18next()) throw new Error(ERROR.UNKNOWN_ERROR)'
		expect(line.match(/throw new Error/)).not.toBeNull()
		const newLine	= replaceThrow(line)
		expect(newLine).not.toBe(line)
		expect(newLine.match('/throw new Error/')).toBeNull()
	})

	it('TestLineB',() => {
		const line	= '            if(!await this.initI18next()) errorThrow(ERROR.UNKNOWN_ERROR)'
		expect(line.match(/throw new Error/)).toBeNull()
		const newLine	= replaceThrow(line)
		expect(newLine).toBe(line)
		expect(newLine.match('/throw new Error/')).toBeNull()
	})
	
	it('TestLineC',() => {
		const line = '				e.stack	+= Error().stack'
		expect(line.match(/e\.stack\s+\+=\s+Error\(\)\.stack/)).not.toBeNull()
		const newLine	= replaceWrapper(line)
		expect(newLine).not.toBe(line)
		expect(newLine.match(/e\.stack\s+\+=\s+Error\(\)\.stack/)).toBeNull()
	})

	it('TestFoundUtil',() => {
		const line	= `import {utils}		from '../utils/Utils.js'`
		expect(line.match(/import\s+\{utils.*from.*utils\/Utils\.js/)).not.toBeNull()
		const lineB	= `import {utils}		from '../utils/UtilsB.js'`
		expect(lineB.match(/import\s+\{utils.*from.*utils\/Utils\.js/)).toBeNull()
	})

	it('TestFindRequire',() => {
		const content	=
`The core model for note
import PouchDB	from 'pouchdb'
const log		= require('loglevel').getLogger('../model/NoteModel.js')
log.setLevel('trace')
const {User}	= require('./User.js')
const {ERROR}	= require('../error.js')
const {Hashtag}	= require('./Hashtag.js')
const {Note}	= require('./Note.js')
const {DBNote}	= require('./DBNote.js')
const {utils}	= require('../utils/Utils.js')
const {HashtagModel}		= require('./HashtagModel.js')`
		let lines		= content.split('\n')
		let linesCounter	= lines.length

		let result		= doUtilsRequire(lines)

		expect(result.foundUtils).toBe(true)
		expect(result.foundFirstRequire).toBe(2)
		expect(result.changed).toBe(false)
		//expect(result.lines.length).toBe(linesCounter + 1)
	})

	it('TestFindRequireB',() => {
		const content	=
`The core model for note
import PouchDB	from 'pouchdb'
const log		= require('loglevel').getLogger('../model/NoteModel.js')
log.setLevel('trace')
const {User}	= require('./User.js')
const {ERROR}	= require('../error.js')
const {Hashtag}	= require('./Hashtag.js')
const {Note}	= require('./Note.js')
const {DBNote}	= require('./DBNote.js')
const {HashtagModel}		= require('./HashtagModel.js')`
		let lines		= content.split('\n')
		let linesCounter	= lines.length

		let result		= doUtilsRequire(lines)

		expect(result.foundUtils).toBe(false)
		expect(result.foundFirstRequire).toBe(2)
		expect(result.changed).toBe(true)
		expect(result.lines.length).toBe(linesCounter + 1)
	})

	it('TestJsFile',() => {
		const content	= 
`The core model for note
import PouchDB	from 'pouchdb'
const log		= require('loglevel').getLogger('../model/NoteModel.js')
log.setLevel('trace')
const {User}	= require('./User.js')
const {ERROR}	= require('../error.js')
const {Hashtag}	= require('./Hashtag.js')
const {Note}	= require('./Note.js')
const {DBNote}	= require('./DBNote.js')
const {HashtagModel}		= require('./HashtagModel.js')
            if(!await this.initI18next()) throw new Error(ERROR.UNKNOWN_ERROR)
		`
		const lines		= content.split('\n')
		expect(lines.some(line => line.match(/throw\s+new\s+Error/) !== null)).toBe(true)
		expect(lines.some(line => line.match('Utils.js') !== null)).not.toBe(true)
		const result	= doJsFile(lines)
		expect(result.changed).toBe(true)
		expect(result.lines).toBeDefined()
		expect(result.lines.some(line => line.match(/throw\s+new\s+Error/) !== null)).not.toBe(true)
		expect(result.lines.some(line => line.match('Utils.js') !== null)).toBe(true)
	})

})
