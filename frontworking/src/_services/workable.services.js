import { _doPost, _doGet, buildURLQuery, API_ROOT } from './utils/services.config';
/**
 *
 */
export const workableService = {
    checkin,
    checkout,
    undoCheckout,
    workingCopy,
    originalCopy,
}
/**
 * Get the original copy.
 *
 * @param workableId
 * @returns
 */
function originalCopy(workableId, idOnly, containerId){
    const uri = '/api/secured/v1/katappult/workables/originalCopy?containerId=' + containerId + "&workableId=" + workableId + "&idOnly=" + idOnly;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Get the working copy
 *
 * @param workableId
 * @param comment
 * @returns
 */
function workingCopy(workableId, idOnly, containerId){
    const uri = '/api/secured/v1/katappult/rc/workingCopy?containerId=' + containerId + "&workableId=" + workableId + "&idOnly=" + idOnly;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Checkout
 * @param workableId
 * @param comment
 * @returns
 */
function checkout(workableId, idOnly, comment, containerId){
    const uri = '/api/secured/v1/katappult/workables/checkout?containerId=' + containerId + "&workableId=" + workableId + "&idOnly=" + idOnly;
    const url = `${API_ROOT}` + uri;
    return _doPost(url);
}
/**
 * Checkin
 * @param workableId
 * @param comment
 * @returns
 */
function checkin(workableId, comment, containerId){
    const uri = '/api/secured/v1/katappult/workables/checkin?containerId=' + containerId  + "&workableId=" + workableId;
    const url = `${API_ROOT}` + uri;
    return _doPost(url, {'comment':'no comment'});
}
/**
 * Undo checkout
 * @param workableId
 * @param comment
 * @returns
 */
function undoCheckout(workableId, comment, containerId){
    const uri = '/api/secured/v1/katappult/workables/undoCheckout?containerId=' + containerId + "&workableId=" + workableId;
    const url = `${API_ROOT}` + uri;
    return _doPost(url);
}
