import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Navbar} from 'react-bootstrap'
import AdminHeaderRight from "./AdminHeaderRight";
import HeaderVersion from "_components/_common/DefaultFooter/HeaderVersion";
import logo from 'assets/logo.png';

const propTypes = {
	children: PropTypes.node,
};

const defaultProps = {};

class AdminLayoutHeader extends Component {

	constructor(props){
		super(props);
	}

	componentDidUpdate(){
		if(this.props.managementPageSelectedTab){
			if(this.props.managementPageSelectedTab.menuGroup !==  null &&
				this.props.managementPageSelectedTab.menuGroup !== this.state.activeMenu){

				this.setState({
					activeMenu: this.props.managementPageSelectedTab.menuGroup
				})
			}
			else if(this.props.managementPageSelectedTab.menuGroup === null &&
				this.props.managementPageSelectedTab.viewName !== this.state.activeMenu){
				this.setState({
					activeMenu: this.props.managementPageSelectedTab.viewName
				})
			}
		}
	}

	componentDidMount(){
		this.setState({dataLoaded: true})
	}

	render() {
		return <>
			<div className={'admin-header-main'}>
				<div className={'admin-header-left core-admin-header-left'}>
					<div className={'logo-container'}>
						<Navbar.Brand href="#/home" onClick={e => e.preventDefault()}>
							<img src={logo} width="100" className="d-inline-block align-top" alt="katappult logo"/>
						</Navbar.Brand>
						<HeaderVersion {...this.props}/>
					</div>
					{/* ADD CUSTOM ADMIN HEADER HERE
						<DemoAdminHeader platformAdminSelected={platformAdminSelected} {...this.props}/>
					*/}
				</div>
				<AdminHeaderRight {...this.props}/>
			</div>
		</>
	}
}

AdminLayoutHeader.propTypes = propTypes;
AdminLayoutHeader.defaultProps = defaultProps;

export default AdminLayoutHeader;

