import React, {Component} from 'react';
import {accountService} from '_services/account.services';

class ContainerOwner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        accountService.accountOfParty(this.props.containerOwnerId, this.props.containerId).then(account => {
            this.setState({account: account, loaded: true});
        })
    }

    getDisplayName() {
        return <>
            {this.state.account && this.state.account.data &&
            <p className="container-details-owner lead">{this.state.account.data.attributes.login}&nbsp;({this.state.account.data.attributes.nickName})</p>
            }
        </>
    }

    render() {
        return <></>
    }
}

export default ContainerOwner;
