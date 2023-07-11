import { _doPost,_doGet,_doPut, API_ROOT, _doDelete, buildURLQuery } from './utils/services.config';

export const CronTaskService = {
    createEntity,
    listEntity,
    updateEntity,
    deleteEntity,
    detailsEntity,
    searchEntity,
    listInstances,
    stopTask,
    taskBeans,
    dropInstance,
}

async function taskBeans(containerId){
    const uri = '/katappult/core/v1/secured/api/cronTasks/listBeans?containerId=' + containerId;
    let url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function stopTask(entityId, instanceId, containerId){
    const uri = '/katappult/core/v1/secured/api/cronTasks/stopInstance?entityId=' + entityId + "&containerId=" + containerId + '&instanceId=' + instanceId;
    let url = `${API_ROOT}` + uri;
    return _doPost(url);
}

async function listInstances(entityId, page, pageSize, containerId){
    const uri = '/katappult/core/v1/secured/api/cronTasks/listInstances?entityId=' + entityId + "&containerId=" + containerId + "&page=" + page + "&pageSize=" + pageSize;
    let url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function dropInstance(entityId, instanceId,containerId){
    const uri = '/katappult/core/v1/secured/api/cronTasks/dropInstance?entityId=' + entityId + "&containerId=" + containerId + '&instanceId=' + instanceId;
    let url = `${API_ROOT}` + uri;
    return _doDelete(url);
}

async function createEntity(formData, containerId){
    const uri = '/katappult/core/v1/secured/api/cronTasks/create';
    let url = `${API_ROOT}` + uri + "?containerId=" + containerId
    return _doPost(url, JSON.stringify(formData))
}

async function listEntity(page, pageSize, containerId){
    const uri = "/katappult/core/v1/secured/api/cronTasks/list?page=" + page + "&pageSize=" + pageSize + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function updateEntity(entityId, formdata, containerId){
    const uri = "/katappult/core/v1/secured/api/cronTasks/update".concat("?containerId=").concat(containerId).concat("&entityId=" + entityId);
    const url = `${API_ROOT}` + uri;
    return _doPut(url, formdata);
}

async function detailsEntity(entityId, containerId){
    const uri = "/katappult/core/v1/secured/api/cronTasks/details?entityId=" + entityId + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function deleteEntity(entityId, containerId){
    const uri = "/katappult/core/v1/secured/api/cronTasks/delete?entityId=" + entityId + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doDelete(url);
}

async function searchEntity(page, pageSize, searchTerm, containerId){
    const uri = "/katappult/core/v1/secured/api/cronTasks/search?searchTerm=" + searchTerm+ "&page="  + page + "&pageSize=" + pageSize + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
