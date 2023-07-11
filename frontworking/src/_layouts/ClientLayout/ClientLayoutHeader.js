import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { commons } from '_helpers/commons';
import {Nav} from 'react-bootstrap';
import {RiLogoutBoxLine, RiUser6Line, RiLoginBoxLine, RiShareCircleLine,} from "react-icons/ri";
import {coreUri} from "_helpers/CoreUri";
import HeaderVersion from "_components/_common/DefaultFooter/HeaderVersion";
import {loginService} from "_services/login.services";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

/**
 * Header navigation bar definition client layout
 */
class ClientLayoutHeader extends Component {

	constructor(props){
		super(props)
		this.state = {
			dataLoaded: true,
			activeMenu: 'home'
		}

		this.logout = this.logout.bind(this);
	}

	toProfile(e){
		if(e) e.preventDefault();
		const myProfileId = commons.getCurrentUserAccountId(this.props.userContext);
		const url = coreUri.backOfficeViewURL("platform", "profile", ["rootId=" + myProfileId]);
		this.props.history.push(url);
	}

	currentConnectedUser(){
		if(!commons.isLoggedInAsUser(this.props.userContext)){
			return <></>
		}

		let firstName = this.props.userContext.userDetails.firstName
		if(firstName){
			return firstName + ' ' + this.props.userContext.userDetails.lastName
		}

		return this.props.userContext.userDetails.addressageName;
	}

	logout (e) {
		e.preventDefault();
		commons.katappult_core_logout();
		loginService.logout().then(response => {});
		this.props.history.push('#/login');
	}

    render() {

		let user = commons.hasRoleUser(this.props.userContext);
		let reader = commons.hasRoleReader(this.props.userContext);

		let isWorkingContainerAdmin = commons.hasRoleAdmin(this.props.userContext) || commons.hasRoleSuperAdmin(this.props.userContext)
		let loginLogoutMenu, profileMenu;
	    if(!user && !reader && !isWorkingContainerAdmin) {
	    	loginLogoutMenu = <Nav.Link href="#/login" className="admin-header-link">
                <RiLoginBoxLine size="2em"/>
				<span>{'Login'}</span>
            </Nav.Link>
	    }
	    else {
	    	loginLogoutMenu = <Nav.Link href="#/login" className='admin-header-link' onClick={(e) => this.logout(e)}>
				<RiLogoutBoxLine size="2em"/>
				<span>{'Logout'}</span>
            </Nav.Link>
	    }

		if(user || reader || commons.hasRoleAdmin(this.props.userContext)) {
			profileMenu =  <Nav.Link className='admin-header-link admin-header-link-profile' onClick={() => this.toProfile()}>
				<RiUser6Line size="2em"/>
				<span>{this.currentConnectedUser()}</span>
			</Nav.Link>
		}

		let adminMenu;
		let adminUrl = "#/admin?tab=platform&view=businessRules";
		if(isWorkingContainerAdmin) {
			adminMenu = <Nav.Link href={adminUrl} className="admin-header-link">
				<RiShareCircleLine size="2em"/>
				<span>{'Administration'}</span>
			</Nav.Link>
		}

        return (
			<div className="admin-header-main">
				<div className="admin-header-left">
					<div className="logo-container">
						<a href={'/#/home'}>
							<img src={process.env.PUBLIC_URL + '/assets/img/katappult_logo.png'} alt="Katappult" width={140}/>
						</a>
	            	</div>
					<HeaderVersion {...this.props}/>
					<div className="admin-header-links admin-header-links-left">
					</div>
				</div>

				<div  className="admin-header-links admin-header-links-right">
					{profileMenu}
					{adminMenu}
					{loginLogoutMenu}
				</div>
			</div>
	    );

		return <div className="header-main"></div>
    }
}

ClientLayoutHeader.propTypes = propTypes;
ClientLayoutHeader.defaultProps = defaultProps;

export default ClientLayoutHeader;
