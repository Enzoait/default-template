import { _doGet, _doPostMp, API_ROOT,_doGetText, _doPut, buildURLQuery } from './utils/services.config';

export const citiesService = {
    byCodePostalLike,
    byNameLike
};

async function byCodePostalLike(postalCode, containerId){
    const uri = "/api/secured/v1/katappult/cities/byCodePostalLike?containerId=" + containerId + "&postalCode=" + postalCode;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function byNameLike(name, containerId){
    const uri = "/api/secured/v1/katappult/cities/byNameLike?containerId=" + containerId + "&name=" + name;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}