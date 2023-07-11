import {
	_doGet,
	_doGetText,
	_doPostMp,
	_doGetBlob,
	API_ROOT, _doPost, _doDelete
}
	from './utils/services.config';
/**
 * Default Export
 */
export const contentHolderService = {
	downloadPrimaryContent,
	downloadPrimaryContentBlob,
	downloadAttachment,
    contentInfos,
    setPrimaryContentFile,
    addAttachment,
	deletePrimaryContent
}

async function addAttachment(contentHolderId, formData){

}
function downloadAttachment(contentHolderId, attachementId){

}

function deletePrimaryContent(contentHolderId, containerId) {
	let uri = '/api/secured/v1/katappult/contentHolder/deleteContent?role=primary&containerId=' + containerId + '&contentHolderId=' + contentHolderId
	let url = `${API_ROOT}` + uri
	return _doDelete(url)
}
/**
 * Download the primary content
 *
 * @param contentHolderId
 * @returns
 */
function downloadPrimaryContent(contentHolderId, containerId) {
	let uri = '/api/secured/v1/katappult/contentHolder/downloadContent?role=primary&containerId=' + containerId + '&contentHolderId=' + contentHolderId
    let url = `${API_ROOT}` + uri
	return _doGetText(url)
}
/**
 * Download primary content.
 *
 * @param contentHolderId
 * @returns
 */
function downloadPrimaryContentBlob(contentHolderId, containerId) {
	let uri = '/api/secured/v1/katappult/contentHolder/downloadContent?role=primary&containerId=' + containerId + '&contentHolderId=' + contentHolderId
    let url = `${API_ROOT}` + uri
	return _doGetBlob(url)
}
/**
 * Set primary content.
 *
 * @param contentHolderId
 * @param formData
 * @returns
 */
function setPrimaryContentFile(contentHolderId, formData, containerId){
	let uri = '/api/secured/v1/katappult/contentHolder/setContentFile?role=primary&containerId=' + containerId + '&contentHolderId=' + contentHolderId
    let url = `${API_ROOT}` + uri
	return _doPostMp(url, formData)
}
/**
 * Get content infos of given content holder.
 *
 * @param contentHolderId
 * @param role primary, attachments, all
 * @returns
 */
function contentInfos(contentHolderId, role, containerId){
	let uri = '/api/secured/v1/katappult/contentHolder/getContentInfo?role=' + role + '&containerId=' + containerId + '&contentHolderId=' + contentHolderId
    let url = `${API_ROOT}` + uri
	return _doGet(url)
}
