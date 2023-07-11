import {_doGet, API_ROOT} from "_services/utils/services.config";

export const persistableService = {
    getById
}

async function getById(id, containerId) {
    const uri = '/api/secured/v1/katappult/persistable/loadSimpleModel?containerId=' + containerId + '&id=' + id;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}