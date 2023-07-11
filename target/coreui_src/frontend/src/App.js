import React from 'react';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history'
import {WaitingPane} from '_components/_common';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const AdminLayout = React.lazy(() => import('_layouts/AdminLayout'));
const LoginLayout = React.lazy(() => import('_layouts/LoginLayout'));

// history
export const browserHistory = createBrowserHistory();
const loading = () => <div className="animated fadeIn pt-3 text-center"><WaitingPane/></div>;


function App(props) {

    return <>
        <HashRouter history={browserHistory}>
            <React.Suspense fallback={loading()}>
                <Switch>
                    <Route exact path="/login" name="Login" render={props => <LoginLayout {...props}/>}/>
                    <Route exact path="/logout" name="Logout" render={props => <LoginLayout {...props}/>}/>
                    <Route exact path={'/view'} name="Back office" component={AdminLayout}/>
                    <Route exact path={'/'} name="Back office" component={AdminLayout}/>
                    <Route path='*' name="Unkown" component={AdminLayout}>
                        <Redirect to={{pathname: '/view?tab=platform&view=businessRules'}}/>
                    </Route>
                </Switch>
            </React.Suspense>
        </HashRouter>
    </>
}

export default App;
