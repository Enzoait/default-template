import React, { Component } from 'react';
import {WaitingPane} from "_components/_common";
import Effectivities from "_components/_admin/BusinessRules/Exclusions/Effectivity/Effectivities";
import {UserExclusions} from "_components/_admin/BusinessRules";
import ExclusionsProcessor from "_components/_admin/BusinessRules/Exclusions/Processors/ExclusionsProcessor";
import ItemsExclusions from "_components/_admin/BusinessRules/Exclusions/Items/ItemsExclusions";

class AllExclusionsView extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        if(this.state.loading) {
            return <WaitingPane/>
        }

        return <div className={'business-rule-exclusions'}>
            <UserExclusions {...this.props}/>
            <ItemsExclusions {...this.props}/>
            <Effectivities {...this.props}/>
            <ExclusionsProcessor {...this.props}/>
        </div>
    }
}

export default AllExclusionsView;


