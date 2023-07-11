import { _doGet, _doPost, _doDelete, _doPut, buildURLQuery, API_ROOT } from './utils/services.config';
/**
 * Default Export
 */
export const catalogService = {
	getCatalogs,
	createCatalog,
	deleteCatalog,
	getById,
	renameCatalog,
	setCatalogDisplayOrder,
	createRootCategory,
	setRootCategories,
	getRootCategories,
	getSelectableCategories,
	removeRootCategory,
	getProductsInCatalog,
	getProductsInCatalogAndInCategory,
	getProductsInCatalogAndNotInCategory,
	getCatalogsByType,
	getCatalogMembers,
	getNotMembersByNameLike,
	getMembersByNameLike,
	getNotMembers,
	allProductsInCatalog,
	addMember,
	removeMember,
	categorizeMember,
	deCategorizeMember,
	searchAllProductsInContainer,
	searchAllProducts_Without_ProductsCatalogCategory_Link
}
async function allProductsInCatalog(catalogId, containerId, params){
	let p = buildURLQuery(params);
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/allProductsInCatalog?containerId=' + containerId + "&".concat(p).concat('&catalogId=' + catalogId);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function searchAllProductsInContainer(searchTerm, catalogId, containerId, params){
	let p = buildURLQuery(params);
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/allProductsInContainer?containerId=' + containerId +
		"&searchTerm=" + searchTerm + "&".concat(p).concat('&catalogId=' + catalogId);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function searchAllProducts_Without_ProductsCatalogCategory_Link(catalogId, categoryId, containerId, searchTerm, params){
	let p = buildURLQuery(params);
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/allProductsNotInCategory?containerId=' + containerId +
		"&categoryId=" + categoryId + "&searchTerm=" + searchTerm + "&".concat(p).concat('&catalogId=' + catalogId);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getCatalogsByType(typePath, states, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/getByType?typePath=' + encodeURI(typePath) + '&states=' + states + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function categorizeMember(catalogId, memberId, categoryId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/members/category?categoryId=' + categoryId + '&containerId=' + containerId + '&catalogId=' + catalogId + '&memberId=' + memberId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}
async function deCategorizeMember(catalogId, memberId, categoryId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/members/category?categoryId=' + categoryId + '&containerId=' + containerId + '&catalogId=' + catalogId + '&memberId=' + memberId;
	const url = `${API_ROOT}` + uri;
	return _doDelete(url);
}
function addMember(catalogId, memberId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/members?containerId=' + containerId + '&catalogId=' + catalogId + '&memberId=' + memberId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}
async function removeMember(catalogId, memberId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/members?containerId=' + containerId + '&catalogId=' + catalogId + '&memberId=' + memberId;
	const url = `${API_ROOT}` + uri;
	return _doDelete(url);
}
async function getCatalogMembers(catalogId, params){
	return getProductsInCatalog(catalogId, params)
}
async function getNotMembers(catalogId, params){
	let p = buildURLQuery(params);
	if(params.containerId === null) return null;
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/notMembers?'.concat(p).concat('&catalogId=' + catalogId);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getMembersByNameLike(catalogId, nameLike, containerId, params){
	let p = buildURLQuery(params);
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/membersByNameLike?nameLike=' + nameLike + '&containerId=' + containerId + "&".concat(p).concat('&catalogId=' + catalogId)
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getNotMembersByNameLike(catalogId, nameLike, containerId, params){
	let p = buildURLQuery(params);
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/notMembersByNameLike?nameLike=' + nameLike + '&containerId=' + containerId + "&".concat(p).concat('&catalogId=' + catalogId)
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getProductsInCatalog(catalogId, params){
	let p = buildURLQuery(params);
	if(params.containerId === null) return null;
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/members?'.concat(p).concat('&catalogId=' + catalogId);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getProductsInCatalogAndInCategory(catalogId, params){
	let p = buildURLQuery(params);
	if(params.containerId === null) return null;
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/membersInCategory?'.concat(p).concat('&catalogId=' + catalogId);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getProductsInCatalogAndNotInCategory(catalogId, params){
	let p = buildURLQuery(params);
	if(params.containerId === null) return null;
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/membersNotInCategory?'.concat(p).concat('&catalogId=' + catalogId);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getSelectableCategories(catalogId, linkableCategoryTypeId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/allCategories?containerId=' + containerId + '&categoryTypeId=' + linkableCategoryTypeId + '&catalogId=' + catalogId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getRootCategories(catalogId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/rootCategories?containerId=' + containerId + '&catalogId=' + catalogId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function createRootCategory(catalogId, formData, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/rootCategories/add?containerId=' + containerId + '&catalogId=' + catalogId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}
async function setRootCategories(catalogId, categoriesId, containerId){
	let categories = categoriesId.join(',')
	if(categoriesId.length === 0) return null
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/setRootCategories?containerId=' + containerId + '&rootCategoriesId=' + categories + '&catalogId=' + catalogId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}
async function removeRootCategory(catalogId, rootCategoryId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/rootCategories/delete?containerId=' + containerId + '&catalogId=' + catalogId + '&rootCategoryId=' + rootCategoryId;
	const url = `${API_ROOT}` + uri;
	return _doDelete(url);
}
/**
 * @returns
 */
async function getById(catalogId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/byId?containerId=' + containerId + '&catalogId=' + catalogId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
/**
 * @returns
 */
async function getCatalogs(params){
	let p = buildURLQuery(params);
	if(params.containerId === null) return null;
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/list?'.concat(p);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
/**
 * @returns
 */
async function createCatalog(formData){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/create';
	const url = `${API_ROOT}` + uri;
	return _doPost(url, JSON.stringify(formData));
}
/**
 * @returns
 */
async function renameCatalog(catalogId, formData, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/rename?containerId=' + containerId + '&catalogId=' + catalogId;
	const url = `${API_ROOT}` + uri;
	return _doPut(url, formData);
}
/**
 * @returns
 */
async function setCatalogDisplayOrder(catalogId, formData, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/setDisplayOrder?containerId=' + containerId + '&catalogId=' + catalogId;
	const url = `${API_ROOT}` + uri;
	return _doPut(url, formData);
}
/**
 * @returns
 */
async function deleteCatalog(catalogId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog?containerId=' + containerId + '&catalogId=' + catalogId;
	const url = `${API_ROOT}` + uri;
	return _doDelete(url);
}
