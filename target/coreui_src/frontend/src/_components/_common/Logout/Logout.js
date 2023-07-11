import React from 'react';
import {commons} from '_helpers/commons';
import {WaitingPane} from '_components/_common';
import {coreUri} from "_helpers/CoreUri";

class Logout extends React.Component{
	
	constructor(props){
		super(props)
		this.state ={
		}
	}

	componentDidMount(){
		commons.katappult_core_logout();
		const loginUrl = coreUri.clientSideRenderedURL('/login');
		window.location.href = loginUrl;
	}
	
	render(){
		return <WaitingPane waitingMessage="Bye"/>
	}
}


export default Logout;