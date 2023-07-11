import { _doGet, _doPost, _doDelete, _doPut, buildURLQuery, API_ROOT } from './utils/services.config';
/**
 * Rev controlled
 */
export const suggestionService = {
	getRefsOfToken,
	getAllByType,
	getDetailsOf,
	removeSuggestion,
	addSuggestion
}
async function getDetailsOf(id, containerId){
	const uri = '/katappult/core/v1/secured/api/suggestionsFeed/' + id + '?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function removeSuggestion(suggestionId, reference, containerId){
	const uri = '/katappult/core/v1/secured/api/suggestionsFeed/' + suggestionId + '/suggestions/' + reference + '?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doDelete(url);
}
async function addSuggestion(suggestionId, reference, containerId){
	const uri = '/katappult/core/v1/secured/api/suggestionsFeed/' + suggestionId + '/suggestions/' + reference + '?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}

async function getAllByType(typeId, containerId){
	const uri = '/katappult/core/v1/secured/api/suggestionsFeed?typeId=' + typeId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

/**
 * @param login
 * @returns
 */
async function getRefsOfToken(token, containerId) {
	const uri = '/v1/secured/api/suggestionsFeed/byToken?token=' + token + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}