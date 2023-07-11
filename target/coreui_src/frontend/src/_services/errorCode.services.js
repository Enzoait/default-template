import { _doGet, API_ROOT} from './utils/services.config';

export const errorCodeService = {
    listEntity,
    searchEntity
}
async function listEntity(containerId){
    const uri = "/api/secured/v1/katappult/errorCodes/list?containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function searchEntity(page, pageSize, searchTerm, containerId){
    const uri = "/api/secured/v1/katappult/errorCodes/search?searchTerm=" + searchTerm+ "&page="  + page + "&pageSize=" + pageSize + "&containerId=" + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
