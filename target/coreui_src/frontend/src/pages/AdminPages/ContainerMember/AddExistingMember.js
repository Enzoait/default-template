import React, { Component } from 'react';

class AddExistingMember extends Component {
	constructor(props){
		super(props)
		
		this.renderResult = this.renderResult.bind(this)
	}
	
	renderResult(response){
	}
	
    render() {
    	let title = this.props.title ? this.props.title :  "Manage container members";
    	//const renderResult = this.props.renderResult ? this.props.renderResult : this.renderResult;
    	
        return ( 
            <React.Fragment>
                <div id="NavigateMembers_searchResults">
                	
               </div>
           </React.Fragment>
        )
    }
}

export default AddExistingMember;

