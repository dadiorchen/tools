//template for react component
//@flow
import React		from 'react'
import {compose}		from 'redux'
import {connect}		from 'react-redux'

import {Factory}		from '../factory.js'
import {summerConnect}		from '../summer/summerConnect.js'
import {type StateType}		from '../model/store.js'

const log	= require('loglevel').getLogger('../component/MindmapContextMenu.js')


type Props	= {
}
type State	= {
}
export class MindmapContextMenu extends React.Component<Props,State>{
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

export const MindmapContextMenuConnected		= compose(
	connect(
		(state : StateType) => {
			return {
			}
		}
	),
	summerConnect(
		(factory : Factory) => {
			return {
			}
		}
	)
)(MindmapContextMenu)
