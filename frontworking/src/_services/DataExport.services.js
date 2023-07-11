import {
    _doPost,
    _doGet,
    _doPut,
    API_ROOT,
    _doDelete,
    buildURLQuery,
    _doGetText,
    _doPostWithoutResponse
} from './utils/services.config';

export const DataExportService = {
    createEntity,
    listEntity,
    updateEntity,
    deleteEntity,
    detailsEntity,
    searchEntity,
    getAllConfigs,
    runExport,
    listInstances,
    stopExport,
    dropExport,
    downloadExport,
    getByInternalName
}

async function createEntity(formData, containerId){
    const uri = '/katappult/core/v1/secured/api/dataExports/create';
    let url = `${API_ROOT}` + uri + "?containerId=" + containerId
    return _doPost(url, JSON.stringify(formData))
}

async function runExport(entityId, form, containerId){
    const uri = '/katappult/core/v1/secured/api/dataExports/runExport?entityId=' + entityId + "&containerId=" + containerId;
    let url = `${API_ROOT}` + uri;
    return _doPostWithoutResponse(url, JSON.stringify(form));
}

async function stopExport(entityId, instanceId, containerId){
    const uri = '/katappult/core/v1/secured/api/dataExports/stopExport?entityId=' + entityId + "&containerId=" + containerId + '&instanceId=' + instanceId;
    let url = `${API_ROOT}` + uri;
    return _doPost(url);
}

async function dropExport(entityId, instanceId, containerId){
    const uri = '/katappult/core/v1/secured/api/dataExports/dropExport?entityId=' + entityId + "&containerId=" + containerId + '&instanceId=' + instanceId;
    let url = `${API_ROOT}` + uri;
    return _doDelete(url);
}

async function listInstances(entityId, page, pageSize, containerId){
    const uri = '/katappult/core/v1/secured/api/dataExports/listInstances?entityId=' + entityId + "&containerId=" + containerId + "&page=" + page + "&pageSize=" + pageSize;
    let url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function downloadExport(entityId, containerId){
    const uri = '/katappult/core/v1/secured/api/dataExports/downloadExport?instanceId=' + entityId + "&containerId=" + containerId;
    let url = `${API_ROOT}` + uri;
    return _doGetText(url);
}


async function getAllConfigs(containerId){
    const uri = "/katappult/core/v1/secured/api/dataExports/configs?containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function getByInternalName(name, containerId){
    const uri = "/katappult/core/v1/secured/api/dataExports/getByInternalName?containerId=" + containerId + '&internalName=' + name;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}


async function listEntity(page, pageSize, containerId){
    const uri = "/katappult/core/v1/secured/api/dataExports/list?page=" + page + "&pageSize=" + pageSize + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function updateEntity(entityId, formdata, containerId){
    const uri = "/katappult/core/v1/secured/api/dataExports/update".concat("?containerId=").concat(containerId).concat("&entityId=" + entityId);
    const url = `${API_ROOT}` + uri;
    return _doPut(url, formdata);
}

async function detailsEntity(entityId, containerId){
    const uri = "/katappult/core/v1/secured/api/dataExports/details?entityId=" + entityId + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function deleteEntity(entityId, containerId){
    const uri = "/katappult/core/v1/secured/api/dataExports/delete?entityId=" + entityId + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doDelete(url);
}

async function searchEntity(page, pageSize, searchTerm, containerId){
    const uri = "/katappult/core/v1/secured/api/dataExports/search?searchTerm=" + searchTerm+ "&page="  + page + "&pageSize=" + pageSize + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
