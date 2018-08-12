//template for react component
//@flow
import React 		from 'react'

const log			= require('loglevel').getLogger(INPUT)


type Props	= {
}
type State	= {
}
export class MyComponent extends React.Component<Props,State>{
	/********************** properties ************/
	constructor( props : Props){
		super(props);
		this.state = {
		}
	}
	/********************** react method ***********/
	/********************** component method *******/
	render(){
		return(
			<div>MyComponent...</div>
		)
	}
}



