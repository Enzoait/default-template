import { _doGet, buildURLQuery, API_ROOT } from './utils/services.config';

/**
 * Export
 */
export const listValuesService = {
	names,
	listvalues,
	noLocale,
	details
};
async function listvalues(formData) {
	let p = buildURLQuery(formData);
	const uri = '/api/secured/v1/katappult/listvalues?containerId=:containerId&'.concat(p);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function names(containerId) {
	const uri = '/api/secured/v1/katappult/listvalues/names?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function noLocale(formData, containerId) {
	let p = buildURLQuery(formData);
	const uri = '/api/secured/v1/katappult/listvalues/noLocale?containerId=' + containerId + '&'.concat(p);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function details(id, containerId) {
	const uri = '/api/secured/v1/katappult/listvalues/details?containerId=' + containerId + '&id=' + id;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
