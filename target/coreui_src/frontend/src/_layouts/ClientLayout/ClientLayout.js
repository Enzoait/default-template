import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import {commons} from '_helpers/commons';
import { ToastContainer } from 'react-toastify';
import { loginService } from '_services/login.services';
import {updateUserContext} from '_reducers/coreUserContextReducer'
import routes from 'routes/all-routes';
import {WaitingPane } from '_components/_common';

const loading = () => <div className="animated fadeIn pt-1 text-center"><WaitingPane /></div>

const GenericHomeLayoutHeader = React.lazy(() => import('./ClientLayoutHeader'));

const mapStateToProps = store => ({
	userContextRX: store.userContextStore.userContext
});

const mapDispatchToProps = (disptach) => ({
	updateUserContextRX: (e) => disptach(updateUserContext(e)),
})

class ClientLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
        	loadingApplicationContext: true
        }
    }

	userDoesntHaveSessionId(){
		let sessionId = commons.sessionId()
		return !sessionId;
	}

	componentDidUpdate(prevProps, prevState){
    	if(!this.state.loadingApplicationContext) {
			if (this.userDoesntHaveSessionId()) {
				window.location.href = '#/login';
			}
			// the login page has called clearUserContextRX and so the session id was set to not_authentified
			// In this case reload all context
			else if (this.props.userContextRX.sessionId === 'not_authentified' && !this.state.loadingApplicationContext) {
				if (this.props.userContextRX.userAccount.nickName) {
					this.loadUserContext()
				}
			}
		}
	}

	componentDidMount(){
		if(this.userDoesntHaveSessionId()){
			window.location.href = '#/login';
		}
		else {
			this.loadUserContext()
		}
	}

	async loginAsAnon(){
		let response = await loginService.loginAsAnon().then(response => {
				if(response.status !== 200){
					this.handleResponseError(response)
					return null;
				}
				else {
					return response;
				}
			})
			.catch(error => {
				this.props.history.push('/404?code=no_auth1')
			});

		if(response){
			let authorization = await response.text();
			if(!authorization){
				this.props.history.push('/404?code=no_auth2')
			}
			else {
				commons.setSessionId(authorization)
				this.loadUserContext(authorization);
			}
		}
		else {
			this.props.history.push('/404?code=no_auth3')
		}
	}

	loadUserContext() {
		let authorization = commons.sessionId()
		loginService.postLogin(authorization).then(response => {
				if(response && response.data) {
					let userContext = commons.katappult_core_loginSuccess(response)
					this.props.updateUserContextRX(userContext);
					this.setState({loadingApplicationContext : false})

					let account = JSON.parse(response.data.links.account)
					let active = account.active;
					if(active) {
						this.props.history.push('/home')
					}
					else {
						let login = account.nickName;
						window.location.href = '#/activateAccount';
					}
				}
		});
	}

  	handleResponseError(error){
  		window.location.href = '/#/500';
  	}

    render() {
    	if(this.state.loadingApplicationContext){
    		return <></>
		}

	 	let mainContent = <Suspense fallback={loading()}>
		     <Switch>
		      {routes.map((route, idx) => {
				   return       <Route
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

	  	return (
			<div className="app demo-app" id={'demo-app'}>
				<GenericHomeLayoutHeader {...this.props}
										 containerId={this.props.userContextRX.workingContainer.id}
										 userContext={this.props.userContextRX}/>;
				<div id={'home-layout-content'} class={'container home-layout-content'}>
					{mainContent}
				</div>

				<ToastContainer
					toastClassName={"our-toast"}
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

export default connect(mapStateToProps, mapDispatchToProps) (ClientLayout);
