import React from 'react';
import {GenderViewer } from '_components/_common';
import {Label} from 'reactstrap';
import moment from 'moment';
import queryString from 'query-string';

export const commons = {
	toastError,
	toastSuccess,
	getValueFromUrl,
	getStatusesFromUrl,
	toJSONObject,
	getPropByString,
	getInputType,
	indexOfItemInArray,
	clone,
	getAttributeViewer,
	getWorkingContainerName,
	getWorkingContainerPath,
	getWorkingContainerId,
	hasRoleAdmin,
	hasRoleSuperAdmin,
	hasRoleReader,
	hasRoleUser,
	hasRoleAnon,
	getRootContainerId,
	getCurrentUserAccountId,
	getCurrentUserAccountOwnerId,
	getRestErrorMessage,
	isRequestError,
	isRequestSuccess,
	getUrlVars,
	arrayRemove,
	setSessionId,
	katappult_core_logout,
	katappult_core_loginSuccess,
	katappult_core_loginError,
	sessionId,
	isLoggedIn,
	getSystemPreference,
	hasRole,
	hasAnyRole,
	katappult_core_isUserConnected,
	katappult_core_isAnonConnected,
	isLoggedInAsUser,
	isLoggedInAsAnon,
	isNotLoggedIn,
	clientContainerId,
	getContainerSetting,
	getBooleanContainerSetting,
	getApiRootURL,
	validateEmail,
	isServer,
	authorizationCookie
}

function isServer (){
	return !(
		typeof window !== 'undefined' &&
		window.document &&
		window.document.createElement
	);
}

function getContainerSetting(containerSettingsRX, key){
	let value = ''
	containerSettingsRX.map(setting => {
		if(setting.attributes.key === key){
			value = setting.attributes.value;
		}
	})

	return value
}

function getBooleanContainerSetting(containerSettingsRX, key){
	let result = this.getContainerSetting(containerSettingsRX, key);
	if(result === 'oui' || result === 'true' || result === 'yes' || result === '1'){
		return true
	}
	return false;
}

function clientContainerId(userContextRX){
	return userContextRX.workingContainer.id
}

function hasAnyRole(userContextRX, roleNames){
	let result = false;
	if(userContextRX.rolesInWorkingContainer){
		userContextRX.rolesInWorkingContainer.map(role => {
			if(roleNames.includes(role.attributes.key)){
				result = true;
			}
		})
	}

	return result;
}

function hasRole(userContextRX, roleName){
	let result = false;
	if(userContextRX.rolesInWorkingContainer){
		userContextRX.rolesInWorkingContainer.map(role => {
			if(role.attributes.key === roleName){
				result = true;
				return true;
			}
		})
	}

	return result;
}

function getSystemPreference(userContextRX, name){
	let result;
	userContextRX.systemPreferences.map(preference => {
		if(preference.attributes.key === name){
			result = preference.attributes.value;
		}
	})
	return result;
}

function getRootContainerId(userContextRX){
	return userContextRX.applicationContainer?.id
}

function getWorkingContainerId(userContextRX){
	return userContextRX.workingContainer?.id
}

/**
 * When fetched single result from remote server, this json object must be
 * parsed like this in order to read attributes on it.
 *
 * @param data
 * @returns JSON object
 */
function toJSONObject(data){
	const d = JSON.stringify(data);
	const datason = JSON.parse(d);
	return datason;
}
function clone(data){
	const d = JSON.stringify(data);
	const datason = JSON.parse(d);
	return datason;
}
/**
 * Resolve attribute value on object.
 * Ex: Will read 'masterAttributes.name' on 'Obj'
 *
 * @param obj
 * @param propString
 * @returns
 */
function getPropByString (obj, propString) {
	if (!propString) return "-";

	let prop, props = propString.split('.');
	let i = 0;
	for (let iLen = props.length - 1; i < iLen; i++) {
		prop = props[i];
		let candidate = obj[prop];
		if (candidate !== undefined) {
			obj = candidate;
		} else {
			break;
		}
	}
	return obj && obj[props[i]] ? obj[props[i]] : '';
}
/**
 *
 * @param {*} attribute
 */
function getInputType(attribute){
	switch(attribute.type){
		case 'string': return 'text';
		case 'text': return 'text';
		case 'textarea': return 'textarea';
		case 'yesno': return 'yesno';
		case 'bool': return 'checkbox';
		case 'radio': return 'radio';
		case 'checkbox': return 'checkbox';
		case 'email': return 'email';
		case 'tel': return 'tel';
		case 'number': return 'number';
		case 'select': return 'select';
		case 'password': return 'password';
		case 'date': return 'date';
		case 'datetime': return 'datetime';
		case 'file': return 'file';
		default: return 'text';
	}
}
function getAttributeViewer(attribute, value){
	const type = attribute.type
	if( 'gender' === type){
		return (
			<GenderViewer value={value}/>
		)
	}
	else if('bool' === type || 'yesno' === type){
		return <React.Fragment>
			<input type='checkbox' disabled={true} defaultChecked={value} checked={value}/>
		</React.Fragment>
	}
	else if(attribute.staticValue){
		return <Label className="control-value-view">{attribute.staticValue}</Label>
	}
	else if(attribute.displayComponent){
		return attribute.displayComponent(value)
	}
	else if(attribute.type === 'date' || attribute.type === 'datetime'){
		let dateformat = attribute.dateFormat
		if(value === null || value === '') return <span></span>

		const date = moment(value, 'YYYY-MM-DD HH:mm:ss S').format(dateformat);
		return <Label className="control-value-view">{date}</Label>
	}
	else {
		return <Label className="control-value-view">{String(value) === 'undefined' ? '' : String(value)}</Label>
	}
}
/**
 * Get the index of an item in given array.
 * Items arre compared by id
 */
function indexOfItemInArray(item, array){
	let index = -1
	let i= 0
	array.map(d => {
		if(d.id === item.id) index = i
		i++
	})
	return index
}

function getWorkingContainerName(userContextRX){
	return userContextRX.workingContainer.name
}

function getWorkingContainerPath(userContextRX){
	return userContextRX.workingContainer.path
}

function getWorkingContainer(userContextRX){
	return userContextRX.workingContainer.id;
}

function hasRoleAdmin(userContextRX){
	let admin = hasAnyRole(userContextRX,['ROLE_ADMIN', 'ROLE_SUPERADMIN']) || hasRoleSuperAdmin(userContextRX);
	return admin;
}

function hasRoleSuperAdmin(userContextRX){
	let result = false;
	userContextRX.rolesInApplicationContainer.map(role => {
		if(role.attributes.key === 'ROLE_SUPERADMIN'){
			result = true;
			return true;
		}
	})

	return result;
}

function hasRoleReader(userContextRX){
	if(userContextRX.rolesInWorkingContainer.length === 0){
		return true
	}
	return hasRole(userContextRX, 'ROLE_READER')
}

function hasRoleUser(userContextRX){
	if(userContextRX.rolesInWorkingContainer.length === 0){
		return false;
	}
	return hasRole(userContextRX,'ROLE_USER')
}

function hasRoleAnon(userContextRX){
	if(userContextRX.rolesInWorkingContainer.length === 0){
		return true
	}
	return hasRole(userContextRX,'ROLE_ANON')
}


/**
 * Return true if current user is super admin
 * @returns
 */
function isSuperAdministrator(userContextRX){
	if(userContextRX.rolesInWorkingContainer.length === 0){
		return false
	}
	return hasRole(userContextRX, 'ROLE_SUPERADMIN')
}
/**
 * @returns
 */
function getCurrentUserAccountId(userContextRX){
	return userContextRX.userAccount.id
}
/**
 * @returns
 */
function getCurrentUserAccountOwnerId(userContextRX){
	return userContextRX.userDetails.id
}
function getUrlVars() {
	let lets = {};
	return lets;
}
function arrayRemove(arr, value) {
	return arr.filter(function(ele){
		return ele != value;
	});
}

function sessionId(){
	return getAuthorizationCookie();
}

function getCurrentUserAccountLogin(userContextRX){
	return userContextRX.userAccount.nickName;
}

function katappult_core_logout() {
	localStorage.clear();
	document.cookie = 'Authorization=; Max-Age=0; Path=/';
}

function setSessionId(session_id){
	localStorage.setItem('Authorization', session_id);
}

function katappult_core_loginSuccess(response) {
	let links = response.data.links;
	let userContext = {}
	userContext.rolesInApplicationContainer  = links.rolesInApplicationContainer.data
	userContext.rolesInWorkingContainer = links.rolesInWorkingContainer.data
	userContext.userPreferences = links.userPreferences.data
	userContext.systemPreferences = links.systemPreferences?.data
	userContext.workingContainer = JSON.parse(links.workingContainer)
	userContext.applicationContainer = JSON.parse(links.applicationContainer)
	userContext.userAccount = JSON.parse(links.account)
	userContext.userDetails = JSON.parse(links.user)
	userContext.applicationCurrentEnvironmentName = links.applicationCurrentEnvironmentName
	userContext.applicationFriendlyName = links.applicationFriendlyName

	let isanon = userContext.userAccount.nickName === 'epanon';
	let isepadmin = userContext.userAccount.nickName === 'epadmin';
	if(isanon) {
		userContext.rolesInWorkingContainer = [{attributes:{key: 'ROLE_ANON'}}]
	}
	else if(isepadmin){
		userContext.rolesInWorkingContainer = [{attributes:{key: 'ROLE_ADMIN'}}, {attributes:{key: 'ROLE_USER'}}]
	}
	return userContext;
}

function katappult_core_loginError(){
}

function katappult_core_isUserConnected (userContextRX) {
	let sessionId = getAuthorizationCookie(),
		session_valid = sessionId !== undefined && sessionId != null;
	return session_valid && userContextRX.userAccount && userContextRX.userAccount.nickName !== 'epanon';
}

function katappult_core_isAnonConnected(userContextRX){
	let result = userContextRX.userAccount.nickName === 'epanon'
	return result;
}

function isNotLoggedIn(userContextRX){
	return !katappult_core_isUserConnected(userContextRX)
}

function isLoggedIn(userContextRX){
	return katappult_core_isUserConnected(userContextRX) || commons.katappult_core_isAnonConnected(userContextRX);
}

function isLoggedInAsUser(userContextRX){
	return katappult_core_isUserConnected(userContextRX) && !commons.katappult_core_isAnonConnected(userContextRX);
}

function isLoggedInAsAnon(userContextRX){
	return commons.katappult_core_isAnonConnected(userContextRX);
}

function validateEmail(email){
	if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
		return false
	}
	return true
}

function getApiRootURL(){
	const backendRootContext = process.env.REACT_APP_CONTEXT_ROOT;
	const hostname = window && window.location && window.location.hostname;
	const port = window && window.location && window.location.port;
	const origin = window && window.location && window.location.origin;
	const proxyURL = process.env.REACT_APP_PROXY_URL

	let API_ROOTV;
	if(proxyURL){
		API_ROOTV = proxyURL;
	}
	else {
		if (/^localhost/.test(hostname) && port && (port === '3000' || port === '3001')) {
			API_ROOTV = `http://${hostname}:8080/${backendRootContext}`;
		} else {
			API_ROOTV = `${origin}/${backendRootContext}`;
		}
	}
	return API_ROOTV;
}

function isRequestError(response){
	return !response || response.status === 'error'
		||  response.status === 500 ||  response.status === '500'
		||  response.status === 404 ||  response.status === '404'
		||  response.status === 400 ||  response.status === '400'
		||  response.status === 401 ||  response.status === '401'
}

function isRequestSuccess(response){
	return !isRequestError(response);
}

function getRestErrorMessage(response) {
	return response ? response.message : 'Erreur interne, veuillez contacter le support';
}

function toastError(response) {
	return <div>
		<div style={{'font-size':"13px",'font-weight':'bold'}}>
			<span>{response.errorFamily}</span>
			{response.errorCode ? <span> - {response.errorCode}</span> : ''}
		</div>
		<div style={{'display': 'flex','margin':'0.6rem'}}>
			<i className={'fa fa-exclamation-triangle fa-lg'} style={{'margin-top':'0.5rem'}}></i>
			<div style={{'font-size':"13px",'margin-left':'1rem'}}>{response.message}</div>
		</div>
	</div>
}

function toastSuccess(textInfo) {
	const content = <div className={'toast-info'}>
		<i className={'fa fa-check-circle fa-md'}></i>
		<div className={'message'}>{textInfo}</div>
	</div>

	return content;
}

function getValueFromUrl (token)  {
	const href = window.location.href
	if(href.split('?').length > 0){
		const urlParams  = queryString.parse("?" + href.split('?')[1])
		return urlParams[token] ? urlParams[token] : ''
	}

	return '';
}

function getStatusesFromUrl ()  {
	const href = window.location.href
	let statuses = []
	if(href.split('?').length > 0){
		const urlParams  = queryString.parse("?" + href.split('?')[1])
		const statusesFromUrl = urlParams["status[]"]
		if(!Array.isArray(statusesFromUrl) && statusesFromUrl){
			statuses.push(statusesFromUrl)
		}
		else {
			statuses = statusesFromUrl
		}
	}

	return statuses ? statuses : [];
}

function authorizationCookie(){
	return getAuthorizationCookie();
}

function getAuthorizationCookie(){
	let authorization = localStorage.getItem('Authorization');

	// get it from cookies
	if(!authorization){
		authorization = document.cookie
			.split('; ')
			.find((row) => row.startsWith('Authorization'))
			?.split('=')[1];

		if(authorization) localStorage.setItem('Authorization', authorization);
	}

	return authorization ? authorization : '';
}
