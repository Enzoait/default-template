import React, { Component } from 'react';
import {WaitingPane, EmptyPane} from '_components/_common'

class BlockedMembership extends Component {

	constructor(props){
		super(props)
		this.state ={
			loading: false,
			members: [],
			
			queryFilters:{
				page: 0,
				pageSize: 10,
			}
		}
	}

	componentDidUpdate(prevProps, prevState){	
	}
	
    render() {
    	if(this.state.loading){
    		return <WaitingPane/>
    	}
    	
    	if(this.state.members.length <= 0){
    		return <EmptyPane />
    	}
    	
        return (
            <div>Content</div>
        );
    }
}


export default BlockedMembership


