import {_doGet, _doDelete, _doPut, buildURLQuery, API_ROOT, _doPost} from './utils/services.config';
/**
 * Default Export
 */
export const enTemplateService =  {
    getById,
    deleteTemplate,
    updateTemplate,
    seartTemplateByNameLike,
    create,
    listAllInContainer
};
async function listAllInContainer(containerId){
    let uri = '/api/secured/v1/katappult/enTemplates/listAllInContainer?containerId=' + containerId;
    let url = `${API_ROOT}` + uri
    return _doGet(url)
}
async function create(formData, containerId){
    let uri = '/api/secured/v1/katappult/enTemplates/create?containerId=' + containerId;
    let url = `${API_ROOT}` + uri
    return _doPost(url, JSON.stringify(formData))
}
async function getById(id, containerId) {
    const uri = "/api/secured/v1/katappult/enTemplates/byId".concat("?containerId=").concat(containerId).concat("&id=" + id);
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
async function deleteTemplate(id, containerId) {
    const uri = "/api/secured/v1/katappult/enTemplates/delete".concat("?containerId=").concat(containerId).concat("&id=" + id);
    const url = `${API_ROOT}` + uri;
    return _doDelete(url);
}
async function updateTemplate(id, formdata, containerId) {
    const uri = "/api/secured/v1/katappult/enTemplates/update".concat("?containerId=").concat(containerId).concat("&id=" + id);
    const url = `${API_ROOT}` + uri;
    return _doPut(url, formdata);
}
async function seartTemplateByNameLike(containerId, params){
	let p = buildURLQuery(params);
	const uri = "/api/secured/v1/katappult/enTemplates/searchByNameLike?".concat(p).concat('&containerId=' + containerId);
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
