import {_doGet, _doPost, buildURLQuery, API_ROOT, _doDelete} from './utils/services.config';
/**
 * Default Export
 */
export const containerService = {
    getAllLifecycles,
    getAllFolderTemplates,
    getAllEmailTemplates,
    getAllTeamTemplates,
    getRootTypes,
    getAllMembers,
    getApplicationRootContainer,
    getChildrenContainers,
    getById,
    getByPath,
    getParentContainer,
    getAccessiblesChildrenContainers,
    getOwnedChildrenContainers,
    getAllAccessibleContainers,
    isUserContainerAdmin,
    countMembers,
    createContainer,
    getContainerSettings,
    updateContainerSetting,
    populateContainerSetting,
    getContainersOfOwner,
    populateFromSellsy,
	getAllContainerAdmin,
	containerAdminAdd,
	containerAdminDelete
}
async function populateFromSellsy(containerId){
	const uri = '/api/secured/v1/katappult/contained/populateFromSellsy?containedId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doPost(url);
}
async function getContainersOfOwner(containerId, ownerId){
	const uri = '/api/secured/v1/katappult/container/ofOwner?ownerId=' + ownerId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}
async function populateContainerSetting(containerId){
	const uri = '/api/secured/v1/katappult/container/populateSettings?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doPost(url);
}
async function getContainerSettings(containerId){
	const uri = '/api/secured/v1/katappult/container/settings?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
async function updateContainerSetting(formData, containerId, settingsId){
	const uri = '/api/secured/v1/katappult/container/settings?containerId=' + containerId + '&settingsId=' + settingsId;
	const url = `${API_ROOT}` + uri;
    return _doPost(url, JSON.stringify(formData));
}
async  function createContainer(formData, containerId){
	const uri = '/api/secured/v1/katappult/contained/create?containedId=' + containerId ;
	const url = `${API_ROOT}` + uri;
    return _doPost(url, JSON.stringify(formData));
}
async function countMembers (containerId){
	const uri = '/api/secured/v1/katappult/container/countMembers?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}
async function isUserContainerAdmin(accountId, containerId){
	const uri = '/api/secured/v1/katappult/container/isUserContainerAdmin?accountId=' + accountId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}
async function getAllContainerAdmin(containerId){
	const uri = '/api/secured/v1/katappult/container/allContainerAdmin?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url)
}
async function containerAdminAdd(accountId, containerId){
	const uri = '/api/secured/v1/katappult/container/containerAdmin?accountId=' + accountId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url)
}
async function containerAdminDelete(accountId, containerId){
	const uri = '/api/secured/v1/katappult/container/containerAdmin?accountId=' + accountId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doDelete(url)
}

async function getParentContainer(containerId){
	const uri = '/api/secured/v1/katappult/container/parent?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}
async function getById(containerId){
	const uri = '/api/secured/v1/katappult/container/byId?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}
async function getByPath(path){
	const uri = '/api/secured/v1/katappult/container?path=' + encodeURI(path);
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}
async function getChildrenContainers(containerId){
	const uri = '/api/secured/v1/katappult/container/subContainers?containerId='+ containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}
async function getAllAccessibleContainers(containerId, accountId){
	const uri = '/api/secured/v1/katappult/container/allAccessibleContainers?userAccountId=' + accountId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}

async function getOwnedChildrenContainers(containerId, accountId){
	const uri = '/api/secured/v1/katappult/container/ownerSubContainers?userAccountId=' + accountId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}

async function getAccessiblesChildrenContainers(containerId, accountId){
	const uri = '/api/secured/v1/katappult/container/accessibleSubContainers?userAccountId=' + accountId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}
/**
 * Get the root container
 * @returns
 */
async function getApplicationRootContainer(){
	const uri = "/api/secured/v1/katappult/container?path=%2F";
	const url = `${API_ROOT}` + uri;
    return _doGet(url)
}
/**
 * Get all lifecycles.
 *
 * @param page The page
 * @param pageSize The page size
 * @param includeParentItems Include parent items
 * @returns Promise
 */
async  function getAllLifecycles(containerId, page, pageSize, includeParentItems) {
	let params = {page: page,pageSize:pageSize ,includeParentItems: includeParentItems};
	let p = buildURLQuery(params);
	const uri = '/api/secured/v1/katappult/lifecycles?'.concat(p).concat('&containerId=' + containerId);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Get all folder templates.
 *
 * @param page The page
 * @param pageSize The page size
 * @param includeParentItems Include parent items
 * @returns Promise
 */
async  function getAllFolderTemplates(page, pageSize, includeParentItems, containerId) {
	let params = {page: page,pageSize:pageSize ,includeParentItems: includeParentItems};
	let p = buildURLQuery(params);
	const uri = '/api/secured/v1/katappult/container/folderTemplates?'.concat(p).concat('&containerId=' + containerId);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
async  function getAllEmailTemplates(page, pageSize, includeParentItems, containerId) {
	let params = {page: page,pageSize:pageSize ,includeParentItems: includeParentItems};
	const uri = '/api/secured/v1/katappult/enTemplates/list?containerId=' + containerId + '&' + buildURLQuery(params);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Get all team templates.
 *
 * @param page The page
 * @param pageSize The page size
 * @param includeParentItems Include parent items
 * @returns Promise
 */
async  function getAllTeamTemplates(page, pageSize, includeParentItems, containerId) {
	let params = {page: page,pageSize:pageSize ,includeParentItems: includeParentItems};
	let p = buildURLQuery(params);
	const uri = '/api/secured/v1/katappult/container/teamTemplates?'.concat(p).concat('&containerId=' + containerId);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Get root types.
 *
 * @param includeParentItems Include parent items
 * @returns Promise
 */
async  function getRootTypes(page, pageSize, includeParentItems, containerId) {
	let params = {page: page,pageSize:pageSize ,includeParentItems: includeParentItems};
	let p = buildURLQuery(params);
	const uri = '/api/secured/v1/katappult/types/rootTypes?'.concat(p).concat("&containerId=" + containerId);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Get all members.
 *
 * @param page The page
 * @param pageSize The page size
 * @param includeParentItems Include parent items
 * @returns Promise
 */
async  function getAllMembers(page, pageSize, includeParentItems, containerId) {
	let params = {page: page,pageSize:pageSize ,includeParentItems: includeParentItems};
	let p = buildURLQuery(params);
	const uri = '/api/secured/v1/katappult/container/members?'.concat(p).concat('&containerId=' + containerId);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
