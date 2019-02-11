" command of read template
command! TemplateReactComponent r! sed -n 2,47p ~/work/tools/vim/templates.js




function! RT(className)
	echo "className :" . a:className
	let template = "//@flow\nimport React from \"react\";\n\nexport class " . a:className . " extends React.Component{\n	render(){\n		return(\n			<div>" . a:className . "...</div>\n		)\n	}\n }'"
	echo template
	" call append(0,template)
	return template
endfunction

" echo "OK"
" echo ReactTemplate('Widget')



