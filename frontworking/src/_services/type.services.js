import {_doGet, buildURLQuery, API_ROOT, _doPost} from './utils/services.config';
/**
 * Default Export
 */
export const typeService = {
	getByPath,
	getById,
	getSubtypeOf,
	getLifecycleOf,
	getSubtypeOfRecursive,
	getTypeOf,
	getLinkConstraintsOf,
	createType,
	setLifecycle,
	updateBaseClass
};

async function updateBaseClass(typeId, formData, containerId){
	const uri = '/api/secured/v1/katappult/types/baseClass?containerId=' + containerId + '&typeId=' + typeId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url, JSON.stringify(formData));
}

async function setLifecycle(typeId, id, containerId){
	const uri = '/api/secured/v1/katappult/types/lifecycle?containerId=' + containerId + '&lifecycleId=' + id + '&typeId=' + typeId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}

async function createType(formData, containerId){
	const uri = '/api/secured/v1/katappult/types?containerId=' + containerId ;
	const url = `${API_ROOT}` + uri;
	return _doPost(url, JSON.stringify(formData));
}

async function getById(typeId, containerId){
	const uri = "/api/secured/v1/katappult/types/byId?containerId=" + containerId + '&typeId=' + typeId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function getByPath(typePath, containerId){
	let p = buildURLQuery({path: typePath});
	const uri = "/api/secured/v1/katappult/types/byPath?containerId=" + containerId + '&'.concat(p);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function getSubtypeOf(typeId, includeParentItems, containerId) {
	let p = buildURLQuery({fetchInParent:includeParentItems});
	const uri = "/api/secured/v1/katappult/types/subtypes?containerId=" + containerId  + '&typeId=' + typeId + '&'.concat(p);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function getSubtypeOfRecursive(typeId, includeParentItems, containerId) {
	let p = buildURLQuery({fetchInParent:includeParentItems, recursive: 'true'});
	const uri = "/api/secured/v1/katappult/types/subtypes?containerId=" + containerId  + '&typeId=' + typeId + '&'.concat(p);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function getLifecycleOf(typeId, containerId) {
	const uri = "/api/secured/v1/katappult/types/lifecycle?containerId=" + containerId  + '&typeId=' + typeId
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}


async function getLinkConstraintsOf(linkTypeId, forRoleALogicalPath, containerId){
	const uri = '/api/secured/v1/katappult/typedObjectLink/linkConstraints?forRoleALogicalPath=' + forRoleALogicalPath + '&containerId=' + containerId + '&linkTypeId=' + linkTypeId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);

}

async function getTypeOf(id, containerId){
	const uri = "/api/secured/v1/katappult/typeManaged/typeOf?containerId=" + containerId + "&id=" + id;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
