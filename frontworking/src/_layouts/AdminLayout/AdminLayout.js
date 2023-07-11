import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { commons } from '_helpers/commons';
import allRoutes from 'routes/all-routes';
import {loginService} from "_services/login.services";
import {updateUserContext} from "_reducers/coreUserContextReducer";
import {coreUri} from "_helpers/CoreUri";

const DefaultHeader = React.lazy(() => import('./AdminLayoutHeader'));

const mapStateToProps = store => ({
	userContextRX: store.userContextStore.userContext
});

const mapDispatchToProps = (disptach) => ({
	updateUserContextRX: (e) => disptach(updateUserContext(e)),
})

class AdminLayout extends Component {

	constructor(props){
		super(props)
		this.state = {
			loadingApplicationContext: true
		}
	}

	userDoesntHaveSessionId(){
		let sessionId = commons.sessionId();
		return !sessionId;
	}

	componentDidUpdate(prevProps, prevState){
		if(!this.state.loadingApplicationContext) {
			if (this.userDoesntHaveSessionId()) {
				this.forwardTLoginPage();
			}
			// the login page has called clearUserContextRX and so the session id was set to not_authentified
			// In this case reload all context
			else if (this.props.userContextRX.sessionId === 'not_authentified' && !this.state.loadingApplicationContext) {
				if (this.props.userContextRX.userAccount.nickName) {
					this.loadUserContext();
				}
			}
		}
	}

	componentDidMount(){
		console.log('>>> 00')
		let sessionId = commons.sessionId();
		if(this.userDoesntHaveSessionId()){
			this.forwardTLoginPage();
			return;
		}

		this.loadUserContext();
	}

	forwardTLoginPage(){
		let configuredLoginURL = process.env.REACT_APP_CLIENT_LOGIN_URL;
		let defaultLoginURL = coreUri.clientSideRenderedURL('login');
		if(configuredLoginURL) {
			defaultLoginURL = configuredLoginURL;
		}

		window.location.href = defaultLoginURL;
	}

	async loadUserContext() {
		this.setState({loadingApplicationContext : true})
		let authorization = commons.sessionId();
		console.log('>>> 22')
		const userContext = await loginService.postLogin(authorization).then(response => {
			console.log('>>> 33:: ' + JSON.stringify(response))
			let userContext = commons.katappult_core_loginSuccess(response)
			this.setState({loadingApplicationContext : false})
			return userContext;
		});

		this.props.updateUserContextRX(userContext);
	}

   render() {

		if(!this.props.userContextRX || this.props.userContextRX.sessionId === 'not_authentified'){
			return <>No user context</>;
		}

		const isConnected = commons.katappult_core_isUserConnected(this.props.userContextRX);
		if(!isConnected || (
			!commons.hasRoleAdmin(this.props.userContextRX)
		  	&& !commons.hasRoleSuperAdmin(this.props.userContextRX))
		){
		  window.location.href = coreUri.clientSideRenderedURL('/login?not_admin');
		}

		let mainContent = (
		  <div id="admin-main-content" className="admin-main-content">
				<Suspense>
					 <Switch>
					   {allRoutes.map((route, idx) => {
						  return  <Route
										key={idx}
										path={route.path}
										exact={route.exact}
										name={route.name}
										render={props => (
										  <route.component {...props}
														   containerId={this.props.userContextRX.workingContainer.id}
														   userContext={this.props.userContextRX}/>
										)} />

							})
					   }
					 </Switch>
				</Suspense>
		 </div>
	)

    return (
		<div className="app admin-app">
			<div className="app-header">
				<DefaultHeader
					   {...this.props}
					   containerId={this.props.userContextRX.workingContainer.id}
					   userContext={this.props.userContextRX}/>
			</div>

			<div className="app-body">
				{mainContent}
			</div>

			<ToastContainer toastClassName={"our-toast"}
					bodyClassName={"our-toast-2"}
					position={'top-right'}
					autoClose={2000}
					hideProgressBar={true}
					newestOnTop={false}
					closeOnClick
					draggable
					pauseOnHover/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (AdminLayout);
