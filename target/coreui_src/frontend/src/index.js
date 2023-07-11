import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import App from './App';
import * as serviceWorker from './serviceWorker';

// reducers
import {searchMembersReducer} from '_reducers/searchMembersReducer.js';
import {searchBusinessRulesReducer} from '_reducers/searchBusinessRulesReducer.js';
import {enumerationsReducer} from '_reducers/enumerationsReducer.js';
import {headerSearchReducer} from '_reducers/headerSearchReducer.js';
import {applicationReducer} from '_reducers/applicationReducer.js';
import {imagesCachesReducer} from '_reducers/imagesCachesReducer.js';
import {navigationReducer} from '_reducers/navigationReducer.js';
import {userContextReducer} from '_reducers/coreUserContextReducer.js';
/*--------------------------------------------------------------------------------------------
* REDUX STORE
*--------------------------------------------------------------------------------------------*/
/**
 * All reducers combined.
 * Be aware: key of reducers are crucial (Ex: 'currentUser', 'currentContainers'), it can no be renamed because
 * mapStateToProps access data inside store through this key.
 *
 */
const allReducers = combineReducers({
  searchMembers: searchMembersReducer,
  searchBusinessRules: searchBusinessRulesReducer,
  enumerations: enumerationsReducer,
  headerSearchComp: headerSearchReducer,
  applicationConfig: applicationReducer,
  imagesCaches: imagesCachesReducer,
  navigationConfig: navigationReducer,
  userContextStore: userContextReducer,
    rootReducer: rootReducer,
    serviceWorkerInitialized: false,
    serviceWorkerUpdated: false,
    serviceWorkerRegistration: null,

});

export const store = createStore(allReducers);
export const SW_INIT = 'SW_INIT';
export const SW_UPDATE = 'SW_UPDATE';
/*--------------------------------------------------------------------------------------------
* ReactDOM RENDER APP
*--------------------------------------------------------------------------------------------*/
// make the store available to all container components in the application without passing it explicitly.
// We only need to use it once when rendering the root component, like bellow.
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
//serviceWorker.register({
//    onSuccess: () => store.dispatch({ type: SW_INIT }),
//    onUpdate: reg => store.dispatch({ type: SW_UPDATE, payload: reg }),
//});


function rootReducer(state = {}, action) {
    switch (action.type) {
        case SW_INIT:
            return {
                ...state,
                serviceWorkerInitialized: !state.serviceWorkerInitialized,
            };
        case SW_UPDATE:
            return {
                ...state,
                serviceWorkerUpdated: !state.serviceWorkerUpdated,
                serviceWorkerRegistration: action.payload,
            };
        default:
            return state;
    }
}
