import React, { Component } from 'react';

class ManageContainerMembers extends Component {

	constructor(props){
		super(props)
	}	
	
    render() {
        let isFirstLoad = this.props.loading;
        let loading = (
            <div className="animated fadeIn pt-1 text-center">I am loading...</div>
        )

        let defaultView = <div>
            	<div id="NavigateMembers_SearchMembersResults">
            	</div>
            </div>

        return (
            <div>
                {(() => {
                    switch (isFirstLoad) {
                    case true:   return loading;
                    default:     return defaultView;
                    }
                })()}
            </div>
        );
    }
}


export default ManageContainerMembers


