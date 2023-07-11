import { _doGet,_doPost,_doPut, _doDelete, buildURLQuery, API_ROOT } from './utils/services.config';

export const roleService = {
	getUserRoles,
	addRoleToUser,
	removeRoleToUser,
	searchRoleByNameLike
}

async function searchRoleByNameLike(searchTerm, userAccountId, containerId){
	const uri = '/api/secured/v1/katappult/roles/searchRoleByNameLike?searchTerm=' + searchTerm + '&userAccountId=' + userAccountId
		 + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function removeRoleToUser(userAccountId, roleId, containerId){
	const uri = '/api/secured/v1/katappult/roles/byAccount?containerId=' + containerId + '&roleId=' + roleId + '&userAccountId=' + userAccountId;
	const url = `${API_ROOT}` + uri;
    return _doDelete(url);
}

async function getUserRoles(userAccountId, containerId){
	const uri = '/api/secured/v1/katappult/roles/byAccount?containerId=' + containerId  + '&userAccountId=' + userAccountId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function addRoleToUser(userAccountId, roleId, containerId){
	const uri = '/api/secured/v1/katappult/roles/byAccount/?containerId=' + containerId + '&roleId=' + roleId + '&userAccountId=' + userAccountId;
	const url = `${API_ROOT}` + uri;
    return _doPut(url);
}
