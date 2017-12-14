//template for react component
//@flow
import React from "react";


type Props = {
}
export class MyComponent extends React.Component<Props,{
	//state
}>{
	constructor( props : Props){
		super(props);
		this.state = {
		}
	}
	/********************** properties ************/
	/********************** react methd ***********/
	/********************** component methd *******/
	render(){
		return(
			<div>MyComponent...</div>
		)
	}
}



