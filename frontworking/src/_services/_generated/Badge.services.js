import { _doPost,_doGet,_doPut, API_ROOT, _doDelete, buildURLQuery } from '../utils/services.config';

export const BadgeService = {
    createEntity,
    listEntity,
    updateEntity,
    updateEntityMaster,
    deleteEntity,
    detailsEntity,
    searchEntity,
    // EXPORT
}

async function createEntity(formData, containerId){
    const uri = '/katappult/cloud/platform/v1/secured/api/badge/create';
    var url = `${API_ROOT}` + uri + "?containerId=" + containerId
    return _doPost(url, JSON.stringify(formData))
}

async function listEntity(page, pageSize, containerId, params){
    const uri = "/katappult/cloud/platform/v1/secured/api/badge/list?page=" + page + "&pageSize=" + pageSize + "&containerId=" + containerId;
    let url = `${API_ROOT}` + uri;
    if(params){
       var p = buildURLQuery(params);
       url = url + '&' + p;
    }

    return _doGet(url);
}

async function updateEntity(entityId, formdata, containerId){
    const uri = "/katappult/cloud/platform/v1/secured/api/badge/update".concat("?containerId=").concat(containerId).concat("&entityId=" + entityId);
    const url = `${API_ROOT}` + uri;
    return _doPut(url, formdata);
}

async function updateEntityMaster(entityId, formdata, containerId){
    const uri = "/katappult/cloud/platform/v1/secured/api/badge/updateMaster".concat("?containerId=").concat(containerId).concat("&entityId=" + entityId);
    const url = `${API_ROOT}` + uri;
    return _doPut(url, formdata);
}

async function detailsEntity(entityId, containerId){
    const uri = "/katappult/cloud/platform/v1/secured/api/badge/details?entityId=" + entityId + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function deleteEntity(entityId, containerId){
    const uri = "/katappult/cloud/platform/v1/secured/api/badge/delete?entityId=" + entityId + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doDelete(url);
}

async function searchEntity(page, pageSize, searchTerm, containerId){
    const uri = "/katappult/cloud/platform/v1/secured/api/badge/search?searchTerm=" + searchTerm+ "&page="  + page + "&pageSize=" + pageSize + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

// FUNCTIONS
