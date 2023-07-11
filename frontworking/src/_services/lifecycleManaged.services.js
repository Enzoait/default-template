import { _doGet, buildURLQuery, API_ROOT, _doPost, _doPut } from './utils/services.config';

export const lifecycleManagedService = {
		statesByAction,
		allStates,
		fireStateMailing,
		lifecycleName,
		lifecycleHistory
}
async function lifecycleHistory(lifecycleManagedId, containerId){
	const uri = '/api/secured/v1/katappult/lifecycleManaged/lifecycleHistory?containerId=' + containerId + '&entityId=' + lifecycleManagedId;
	let url = `${API_ROOT}` + uri
	return _doGet(url)
}
async function lifecycleName(lifecycleManagedId, containerId){
	const uri = '/api/secured/v1/katappult/lifecycleManaged/lifecycleName?containerId=' + containerId + '&entityId=' + lifecycleManagedId;
    let url = `${API_ROOT}` + uri
	return _doGet(url)
}
async function statesByAction(lifecycleManagedId, fromState, actionName, containerId){
	const uri = '/api/secured/v1/katappult/lifecycleManaged/statesByAction?fromState=' + fromState + '&actionName=' + actionName + '&containerId=' + containerId + '&entityId=' + lifecycleManagedId;
    let url = `${API_ROOT}` + uri
	return _doGet(url)
}
async function allStates(lifecycleManagedId, containerId){
	const uri = '/api/secured/v1/katappult/lifecycleManaged/allStates?containerId=' + containerId + '&entityId=' + lifecycleManagedId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function fireStateMailing(lifecycleManagedId, containerId){
	const uri = '/api/secured/v1/katappult/lifecycleManaged/fireStateMailing?containerId=' + containerId + '&entityId=' + lifecycleManagedId;
    let url = `${API_ROOT}` + uri
	return _doPost(url)
}
