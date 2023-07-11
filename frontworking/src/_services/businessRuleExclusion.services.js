import { _doPost,_doGet,_doPut, API_ROOT, _doDelete, buildURLQuery } from './utils/services.config';

export const businessRuleExclusionService = {
    createEntity,
    listEntity,
    deleteEntity,
}
async function createEntity(formData, containerId){
    const uri = '/api/secured/v1/katappult/businessRuleExclusions/create';
    let url = `${API_ROOT}` + uri + "?containerId=" + containerId
    return _doPost(url, JSON.stringify(formData))
}

async function listEntity(businessRuleId, type, containerId){
    const uri = "/api/secured/v1/katappult/businessRuleExclusions/list?businessRuleId=" + businessRuleId + "&type=" +  type + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function deleteEntity(entityId, containerId){
    const uri = "/api/secured/v1/katappult/businessRuleExclusions/delete?entityId=" + entityId + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doDelete(url);
}

