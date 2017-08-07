" convert html content to JSX content
" class => className
" style="text-align:center;margin: 22px auto;" => style={{text-align :
" 'center',margin : '22px auto'}}
function! HTML2JSX() range
	echo "begin"
	echo "OK" . a:firstline . "|" . a:lastline
	for lineNumber in range(a:firstline,a:lastline)
		echo "the line:" . lineNumber
		let line = getline(lineNumber)
		let line = s:SingleLine(line)
		call setline(lineNumber,line)	
	endfor
endfunction

function! s:StyleProperty(content)
	let ps = split(a:content,';')
	let result = ''
	for p in ps
		let result = result . substitute(p,'\(\I\+\):\(.*\)','\1:''\2''','g') . ','
	endfor
	return result
endfunction

function! s:SingleLine(line)
	" replate fill-rule="xxxx" to fillRule='xxxx'
	let a = substitute(a:line,'\(\I\+\)-\(\I\+\)=\("\|''\)\(\w\+\)\("\|''\)','\1\u\2=''\4''','g')
	echo a
	let a = substitute(a,'style=\("\|''\)\(.\{-}\)\("\|''\)','\=''style={{''.s:StyleProperty(submatch(2)).''}}''','g')
	return a
endfunction

" the test content
" <svg viewBox="0 0 24 24" role="img" aria-label="Close" focusable="false" style="display: block; fill: rgb(118, 118, 118); height: 16px; width:16px;"><path fill-rule="evenodd" d="M23.25 24a.744.744 0 0 1-.53-.22L1213.062 1.28 23.782a.75.75 0 0 1-1.06-1.06L10.94 12 .22 1.28A.75.75 0 1 11.28.22L12 10.94 22.72.22a.749.749 0 1 1 1.06 1.06L13.062 12l10.7210.72a.749.749 0 0 1-.53 1.28"></path></svg>

" echo "OK"
" echo "OK"
" echo "OK"
" let a='<svg viewBox="0 0 24 24" role="img" aria-label="Close" focusable="false" style="display: block; fill: rgb(118, 118, 118); height: 16px; width:16px;"><path fill-rule=''evenodd'' d="M23.25 24a.744.744 0 0 1-.53-.22L1213.062 1.28 23.782a.75.75 0 0 1-1.06-1.06L10.94 12 .22 1.28A.75.75 0 1 11.28.22L12 10.94 22.72.22a.749.749 0 1 1 1.06 1.06L13.062 12l10.7210.72a.749.749 0 0 1-.53 1.28"></path></svg>'
" echo s:SingleLine(a)
