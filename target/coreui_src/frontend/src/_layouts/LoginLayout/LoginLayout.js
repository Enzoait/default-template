import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import routes from '../../routes/login-routes';
const Page404 = React.lazy(() => import('pages/CommonPages/Page404'));


class LoginLayout extends Component {
	
   loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
	let mainContent = (
		<div id="katappult-main-content">
			<Suspense fallback={this.loading()}>
					<Switch>
					  {routes.map((route, idx) => {
						return route.component ? (
							  <Route
								key={idx}
								path={route.path}
								exact={route.exact}
								name={route.name}
								render={props => (
								  <route.component {...props} userContext={this.props.userContextRX}/>
								)} />
							) : (<Route
									key={idx}
									path={route.path}
									exact={route.exact}
									name={route.name}
									render={props => (
									  <Page404 {...props} />
									)}
								 />)
						})
					  }
					</Switch>
			</Suspense>
	     </div>
	)
	
    return (
      <div className="app">
		  {mainContent}
      </div>
    );
  }
}

export default LoginLayout;

