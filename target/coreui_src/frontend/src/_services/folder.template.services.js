import { _doGet, buildURLQuery, API_ROOT } from './utils/services.config';
/**
 * Default Export
 */
export const folderTemplateService = {
    getById,
    seartTemplateByNameLike
};
/**
 * Get a folder template by its identifier.
 *
 * @param {*} id
 */
async function getById(id, containerId) {
    const uri = "/api/secured/v1/katappult/folderTemplate/getById?containerId=" + containerId + '&id=' + id;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function seartTemplateByNameLike(containerId, params){
	let p = buildURLQuery(params);
	const uri = "/api/secured/v1/katappult/folderTemplate/searchByNameLike?".concat(p);
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
