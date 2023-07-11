import { _doGet, _doPost, _doDelete, _doPut, buildURLQuery, API_ROOT } from './utils/services.config';
/**
 * Default Export
 */
export const categoryService = {
	getRootCategoriesByType,
	getAllCategoriesByType,
	getChildrenCategoriesOf,
	getParentCategoryOf,
	createCategory,
	deleteCategory,
	getById,
	renameCategory,
	updateCategory,
	getCategoryByInternaleName,
	getAllByInternalName,
	getRootCategoriesNoInCurrentCatalog
}
async function getAllByInternalName(internalNames, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/category/allByInternalName?internalNames=' + internalNames + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getCategoryByInternaleName(internalName, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/category/byInternalName?internalName=' + internalName + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
/**
 * Owner is a party or null (system)
 * @returns
 */
async function getRootCategoriesByType(typeId, ownerId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/category/rootCategories?typeId='
		+ typeId + '&'
		+ 'containerId=' + containerId + '&'
		+ 'ownerId=' + ownerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getRootCategoriesNoInCurrentCatalog(typeId, catalogId, containerId, searchTerm){
	const uri = '/katappult/shopbase/v1/secured/api/category/rootCategoriesNoInCurrentCatalog?typeId='
		+ typeId + '&'
		+ 'containerId=' + containerId + '&'
		+ 'searchTerm=' + searchTerm + '&'
		+ 'catalogId=' + catalogId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
/**
 * @returns
 */
async function getAllCategoriesByType(typeId, ownerId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/category/allCategories?typeId='
		+ typeId + '&'
		+ 'containerId=' + containerId + '&'
		+ 'ownerId=' + ownerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
/**
 * @returns
 */
async function getChildrenCategoriesOf(categoryId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/category/children?containerId=' + containerId + '&categoryId=' + categoryId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
/**
 * @returns
 */
async function getById(categoryId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/category/byId?containerId=' + containerId + '&categoryId=' + categoryId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
/**
 * @returns
 */
async function getParentCategoryOf(categoryId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/category/parent?containerId=' + containerId + '&categoryId=' + categoryId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
/**
 * @returns
 */
async function createCategory(formData){
	const uri = '/katappult/shopbase/v1/secured/api/category/create';
	const url = `${API_ROOT}` + uri;
	return _doPost(url, JSON.stringify(formData));
}
/**
 * @returns
 */
async function renameCategory(id, formData, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/category/rename?containerId=' + containerId + '&categoryId=' + id;
	const url = `${API_ROOT}` + uri;
	return _doPut(url, formData);
}
/**
 * @returns
 */
async function updateCategory(categoryId, formData, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/category/update?containerId=' + containerId + '&categoryId=' + categoryId;
	const url = `${API_ROOT}` + uri;
	return _doPut(url, formData);
}
/**
 * @returns
 */
async function deleteCategory(categoryId, catalogId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/category/delete?containerId=' + containerId + '&categoryId=' + categoryId + "&catalogId=" + catalogId;
	const url = `${API_ROOT}` + uri;
	return _doDelete(url);
}
