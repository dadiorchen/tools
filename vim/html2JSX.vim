" convert html content to JSX content
" class => className
" style="text-align:center;margin: 22px auto;" => style={{text-align :
" 'center',margin : '22px auto'}}
function! HTML2JSX() range"{{{
	echo "begin"
	echo "OK" . a:firstline . "|" . a:lastline
	for lineNumber in range(a:firstline,a:lastline)
		echo "the line:" . lineNumber
		let line = getline(lineNumber)
		let line = s:SingleLine(line)
		call setline(lineNumber,line)	
	endfor
endfunction"}}}

function! s:StylePropertyName(name,value)
	echo a:name
	echo a:value
	let result = ''
	if( a:name =~ '\I\+-\I\+')
		let result = substitute(a:name,'\(\I\+\)-\(\I\+\)','\1\u\2','g')
	else
		let result = a:name
	endif
	return result
endfunction

function! s:StyleProperty(content)
	let ps = split(a:content,';')
	let result = ''
	for p in ps
		" let result = result . substitute(p,'\(\I\+\):\(.*\)','\1:''\2''','g')
		let result = result . substitute(p,'\(\I\+-\=\I\+\):\(.*\)','\=s:StylePropertyName(submatch(1),submatch(2)). '':'' . "''" . submatch(2) . "'',"','g')
	endfor
	return result
endfunction


function! s:SingleLine(line)
	" replate fill-rule="xxxx" to fillRule='xxxx'
	" convert:" -> '
	let a = substitute(a:line,'"','''','g')
	" convert: acd-edf='xxxx' --> abcEdf='xxx'
	let a = substitute(a,'\(\I\+\)-\(\I\+\)=''\([^'']\+\)''','\1\u\2=''\3''','g')
	" convert: acd:edf='xxxx' --> abcEdf='xxx'
	let a = substitute(a,'\(\I\+\):\(\I\+\)=''\([^'']\+\)''','\1\u\2=''\3''','g')
	echo a
	let a = substitute(a,'style=''\(.\{-}\)''','\=''style={{''.s:StyleProperty(submatch(1)).''}}''','g')
	return a
endfunction

" the test content
" <svg viewBox="0 0 24 24" role="img" aria-label="Close" focusable="false" style="display: block; fill: rgb(118, 118, 118); height: 16px; width:16px;"><path fill-rule="evenodd" d="M23.25 24a.744.744 0 0 1-.53-.22L1213.062 1.28 23.782a.75.75 0 0 1-1.06-1.06L10.94 12 .22 1.28A.75.75 0 1 11.28.22L12 10.94 22.72.22a.749.749 0 1 1 1.06 1.06L13.062 12l10.7210.72a.749.749 0 0 1-.53 1.28"></path></svg> " {{{}}}

" echo "OK"
" echo "OK"
" echo "OK"
" let a='<svg viewBox="0 0 24 24" role="img" aria-label="Close" focusable="false" style="display: block; fill: rgb(118, 118, 118); height: 16px; width:16px;"><path fill-rule=''evenodd'' d="M23.25 24a.744.744 0 0 1-.53-.22L1213.062 1.28 23.782a.75.75 0 0 1-1.06-1.06L10.94 12 .22 1.28A.75.75 0 1 11.28.22L12 10.94 22.72.22a.749.749 0 1 1 1.06 1.06L13.062 12l10.7210.72a.749.749 0 0 1-.53 1.28"></path></svg>' " {{{}}}
" echo s:SingleLine(a)
" 
" let a='<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="451.846px" height="451.847px" viewBox="0 0 451.846 451.847" style="enable-background:new 0 0 451.846 451.847;"	 xml:space="preserve"><g>	<path d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744		L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284		c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>' " {{{}}}
" 
" echo s:SingleLine(a)
