import { _doGet, _doPost, _doDelete, _doPut, buildURLQuery, API_ROOT } from './utils/services.config';

export const preferencesService = {
		getUserPreferences,
		getSystemPreferences,
		update,
		create,
		drop,
}
function getUserPreferences(ownerId, containerId){
	const uri = '/api/secured/v1/katappult/principals/account/preferences/list?containerId=' + containerId + '&isUser=true' + '&accountId=' + ownerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
function getSystemPreferences(ownerId, containerId){
	const uri = '/api/secured/v1/katappult/principals/account/preferences/list?containerId=' + containerId + '&isUser=false' + '&accountId=' + ownerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
function update(ownerId, preferenceId, containerId, value){
	const uri = '/api/secured/v1/katappult/principals/account/preferences/update?containerId=' + containerId + '&value=' + value + '&accountId=' + ownerId + '&preferenceId=' + preferenceId;
	const url = `${API_ROOT}` + uri;
    return _doPut(url);
}
function create(formData){
	const uri = '/api/secured/v1/katappult/preferences/create';
	const url = `${API_ROOT}` + uri;
    return _doPost(url, JSON.stringify(formData));
}
function drop(preferenceId, containerId){
	const uri = '/api/secured/v1/katappult/preferences/delete?containerId=' + containerId + '&id=' + preferenceId;
	const url = `${API_ROOT}` + uri;
    return _doDelete(url);
}
