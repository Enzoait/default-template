import { _doGet, buildURLQuery, _doPut, API_ROOT } from './utils/services.config';
/**
 * Default Export
 */
export const contactableService = {
	getWebContacts,
	getTelecomContacts,
	getPostalContacts,
	updateWebContacts,
	updateTelecomContacts,
	updatePostalContacts,
	getAllContacts,
	getContactableContactMechanismByRole
};

async function getContactableContactMechanismByRole(contactableId, role, containerId){
	const uri = '/api/secured/v1/katappult/contactable/contacts/byRole?role=' + role + '&containerId=' + containerId + '&contactableId=' + contactableId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

/**
 */
async function getAllContacts(contactableId, containerId){
	const uri = '/api/secured/v1/katappult/contactable/contacts?containerId=' + containerId + '&contactableId=' + contactableId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 */
async function updatePostalContacts(contactableId, contactMecId, payload, containerId){
	const uri = '/api/secured/v1/katappult/contactable/contacts/postal?containerId=' + containerId + '&contactableId=' + contactableId + '&contactMechanismId=' + contactMecId;
	const url = `${API_ROOT}` + uri;
    return _doPut(url, payload);
}
/**
 */
async function updateTelecomContacts(contactableId, contactMecId, payload, containerId){
	const uri = '/api/secured/v1/katappult/contactable/contacts/telecom?containerId=' + containerId + '&contactableId=' + contactableId + '&contactMechanismId=' + contactMecId;
	const url = `${API_ROOT}` + uri;
    return _doPut(url, payload);
}
/**
 */
async function updateWebContacts(contactableId, contactMecId, payload, containerId){
	const uri = '/api/secured/v1/katappult/contactable/contacts/web?add=false&containerId=' + containerId + '&contactableId=' + contactableId + '&contactMechanismId=' + contactMecId;
	const url = `${API_ROOT}` + uri;
    return _doPut(url, payload);
}
/**
 */
async function getPostalContacts(contactableId, contactMecId, containerId){
	const uri = '/api/secured/v1/katappult/contactable/contacts/?containerId=' + containerId + '&contactableId=' + contactableId + '&contactMechanismId=' + contactMecId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 */
async function getTelecomContacts(contactableId, contactMecId, containerId){
	const uri = '/api/secured/v1/katappult/contactable/contacts?containerId=' + containerId + '&contactableId=' + contactableId + '&contactMechanismId=' + contactMecId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 */
async function getWebContacts(contactableId, contactMecId, containerId){
	const uri = '/api/secured/v1/katappult/contactable/contacts?containerId=' + containerId + '&contactableId=' + contactableId + '&contactMechanismId=' + contactMecId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
