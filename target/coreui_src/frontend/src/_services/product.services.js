import { _doGet, _doPost, _doDelete, _doPut, buildURLQuery, API_ROOT } from './utils/services.config';
import moment from 'moment'
/**
 * Default Export
 */
export const productsInstanceService =   {
	getProductsInCatalog,
	getProductsInCatalogCount,
	getProductsInCategory,
	getProductsInCategory2,
	switchCategory,
	getById,
	getByNumber,
	getProductCategories,
	updateIntroductionDate,
	updateDiscontinuationDate,
	updateProduct,
	updateCommercialAttributes,
	createProduct,
	removeFromCategory,
	addToCategories,
	addProductsToCategory,
	removeProductsFromCategory,
	searchProductByCommercialNameLike,
	updateBasePrice,
}
async function searchProductByCommercialNameLike(searchTerm, containerId, params){
	let queryparams = ''
	if(params){
		queryparams = '&'.concat(buildURLQuery(params))
	}
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/byNameLike?containerId=' + containerId + '&name=' + searchTerm.concat(queryparams);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);

}
async function createProduct(formData, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/productInstance?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url, JSON.stringify(formData, containerId));
}
async function updateProduct(productId, formData, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/productInstance?containerId=' + containerId + '&productId=' + productId;
	const url = `${API_ROOT}` + uri;
	return _doPut(url, formData);
}

async function updateBasePrice(productId, formData, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/updateBasePrice?containerId=' + containerId + '&productId=' + productId;
	const url = `${API_ROOT}` + uri;
	return _doPut(url, formData);
}
async function updateCommercialAttributes(productId, formData, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/updateCommercialAttributes?containerId=' + containerId + '&productId=' + productId;
	const url = `${API_ROOT}` + uri;
	return _doPut(url, formData);
}
async function updateIntroductionDate(productId, date, containerId){
	let params = {introductionDate: date}
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/updateIntroductionDate?containerId=' + containerId + '&productId=' + productId;
	const url = `${API_ROOT}` + uri;
	return _doPut(url, params);
}
async function updateDiscontinuationDate(productId, date, containerId){
	let params = {discontinuationDate: date}
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/updateDiscontinuationDate?containerId=' + containerId + '&productId=' + productId;
	const url = `${API_ROOT}` + uri;
	return _doPut(url, params);
}
async function getProductCategories(productId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/categories?containerId=' + containerId + '&productId=' + productId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getProductsInCatalog(catalogId, params, containerId){
	let p = buildURLQuery(params);
	if(params.containerId === null) return null;
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/products?'.concat(p).concat('&containerId=' + containerId + '&catalogId=' + catalogId);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getProductsInCatalogCount(catalogId, params, containerId){
	let p = buildURLQuery(params);
	if(params.containerId === null) return null;
	const uri = '/katappult/shopbase/v1/secured/api/objectCatalog/countProducts?'.concat(p).concat('&containerId=' + containerId + '&catalogId=' + catalogId);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
/**
 * Products in that category in given state.
 *
 * @returns
 */
async function getProductsInCategory(params){
	let p = buildURLQuery(params);
	if(params.containerId === null) return null;
	const uri = '/katappult/shopbase/v1/secured/api/productInstance?'.concat(p);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
/**
 * @returns
 */
async function getProductsInCategory2(categoryId, containerId, states, avalaibleBefore, avalaibleAfter){
	let s = states === undefined || states === null || states.length === 0 ? '' : states.join(',')
	let bef = avalaibleBefore === null && avalaibleBefore !== ''? '' : moment(avalaibleBefore).format("DDMMYYYY")
	let aft = avalaibleAfter === null && avalaibleAfter !== '' ? '' : moment(avalaibleAfter).format("DDMMYYYY")
	let a = 'from:' + aft + 'to:'  + bef
	const uri = '/katappult/shopbase/v1/secured/api/productInstance?c=' + categoryId + '&a=' + a +'&s=' + s + '&at=after&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getByNumber(number, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/byNumber?number=' + encodeURIComponent(number) + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function getById(productId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/byId?containerId=' + containerId + '&productId=' + productId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function removeFromCategory(productId, categoryId, containerId){
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/categories?categoryId=' + categoryId + '&containerId=' + containerId + '&productId=' + productId;
	const url = `${API_ROOT}` + uri;
	return _doDelete(url);
}
async function switchCategory(productId, fromCategoryId, toCategoryId,  containerId){
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/switchCategory?fromCategoryId=' + fromCategoryId + "&toCategoryId=" + toCategoryId + '&containerId=' + containerId + '&productId=' + productId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}
async function addToCategories(productId, categoriesId, containerId){
	let catstring = categoriesId.join(",")
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/categories?categoriesId=' + catstring + '&containerId=' + containerId + '&productId=' + productId;
	const url = `${API_ROOT}` + uri;
	return _doPut(url);
}

/**
 * ADD / REMOVE multiple products from one category
 */
async function addProductsToCategory(productsId, categoryId, containerId){
	let productsIdString = productsId.join(",")
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/addProductsToCategories?products=' + productsIdString + '&categoryId=' + categoryId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doPut(url);
}
async function removeProductsFromCategory(productsId, categoryId, containerId){
	let productsIdString = productsId.join(",")
	const uri = '/katappult/shopbase/v1/secured/api/productInstance/removeProductsFromCategories?products=' + productsIdString + '&categoryId=' + categoryId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doDelete(url);
}
