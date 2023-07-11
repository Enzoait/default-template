import {_doGet, buildURLQuery, API_ROOT, _doPost, _doPut, _doPostMp} from './utils/services.config';

/**
 * Export
 */
export const lifecycleService = {
	details,
	promote,
	setState,
	setStateWithComment,
	setLinkState,
	denote,
	statesBySetState,
	statesByAction,
	statesByPromote,
	statesByDenote,
	getAllPossibleStatesOfLifecyle,
	updateMasterAttributes,
	setStateFromExternalApp,
	createLifecycle,
	archive,
	lifecycleTransitions
};
async function archive(lifecycleId, containerId) {
	const uri = '/api/secured/v1/katappult/lifecycles/archive?containerId=' + containerId + '&entityId=' + lifecycleId;
	let url = `${API_ROOT}` + uri
	return _doPost(url)
}
async function createLifecycle(formData, containerId){
	let uri = '/api/secured/v1/katappult/lifecycles?containerId=' + containerId;
	let url = `${API_ROOT}` + uri
	return _doPostMp(url, formData)
}
async function statesByAction(lifecycleId, fromState, actionName, containerId){
	const uri = '/api/secured/v1/katappult/lifecycles/statesByAction?entityId=' + lifecycleId + '&fromState=' + fromState + '&actionName=' + actionName + '&containerId=' + containerId;
	let url = `${API_ROOT}` + uri
	return _doGet(url)
}
async function updateMasterAttributes(lifecycleId, formData, containerId){
	const uri = '/api/secured/v1/katappult/lifecycles/updateMasterAttributes?containerId=' + containerId + '&entityId=' + lifecycleId;
	let url = `${API_ROOT}` + uri
	return _doPut(url, formData)
}
async function details(lifecycleId, containerId) {
	const uri = '/api/secured/v1/katappult/lifecycles/details?containerId=' + containerId + '&entityId=' + lifecycleId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getAllPossibleStatesOfLifecyle(lifecycleName, containerId){
	const uri = '/api/secured/v1/katappult/lifecycles/allStatesOf?name=' + lifecycleName +'&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

async function lifecycleTransitions(lifecycleId, containerId){
	const uri = '/api/secured/v1/katappult/lifecycles/transitions?entityId=' + lifecycleId +'&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}


async function promote(lifecycleManagedId, containerId) {
	const uri = '/api/secured/v1/katappult/lifecycleManaged/promote?containerId=' + containerId + '&entityId=' + lifecycleManagedId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}
async function denote(lifecycleManagedId, containerId) {
	const uri = '/api/secured/v1/katappult/lifecycleManaged/denote?containerId=' + containerId + '&entityId=' + lifecycleManagedId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}
async function setState(lifecycleManagedId, state, containerId) {
	const uri = '/api/secured/v1/katappult/lifecycleManaged/setState?state=' + state + '&containerId=' + containerId + '&entityId=' + lifecycleManagedId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}
async function setStateWithComment(lifecycleManagedId, state, form, containerId) {
	const uri = '/api/secured/v1/katappult/lifecycleManaged/setStateWithComment?state=' + state + '&containerId=' + containerId + '&entityId=' + lifecycleManagedId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url, JSON.stringify(form));
}
async function setStateFromExternalApp(lifecycleManagedId, state, actionName) {
	const uri = '/api/secured/v1/katappult/lifecycleManaged/setStateFromExternalApp?state=' + state + '&actionName=' + actionName + '&entityId=' + lifecycleManagedId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}
async function setLinkState(roleAid, roleBid, state, linkClass, containerId) {
	const uri = '/api/secured/v1/katappult/lifecycleManaged/setLinkState?state=' + state + '&linkClass=' + linkClass + '&containerId=' + containerId + '&roleBid=' + roleBid + '&roleAid=' + roleAid;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}

async function statesBySetState(lifecycleManagedId, containerId) {
	const uri = '/api/secured/v1/katappult/lifecycleManaged/statesBySetState?containerId=' + containerId + '&entityId=' + lifecycleManagedId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function statesByPromote(lifecycleManagedId, containerId) {
	const uri = '/api/secured/v1/katappult/lifecycleManaged/stateByPromote?containerId=' + containerId + '&entityId=' + lifecycleManagedId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function statesByDenote(lifecycleManagedId, containerId) {
	const uri = '/api/secured/v1/katappult/lifecycleManaged/stateByDenote?containerId=' + containerId + '&entityId=' + lifecycleManagedId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
