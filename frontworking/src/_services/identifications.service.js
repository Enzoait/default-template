import {_doGet,  API_ROOT, _doPost} from './utils/services.config';

export const identificationsService = {
    getIdentifications,
    createIdentification
};

async function getIdentifications(identified, containerId){
    const uri = '/api/secured/v1/katappult/multiIdentifiable/identifications?containerId=' + containerId + '&multiIdentifiableId=' + identified;
    const url = `${API_ROOT}` + uri
    return _doGet(url)
}

async function createIdentification(formData, identified, containerId){
    const typeId = formData.typeId
    const uri = '/api/secured/v1/katappult/multiIdentifiable/addIdentification?containerId=' + containerId + '&id=' + identified + "&typeId=" + typeId;
    const url = `${API_ROOT}` + uri
    return _doPost(url, JSON.stringify(formData))
}
