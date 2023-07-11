import { _doGet, buildURLQuery, API_ROOT } from './utils/services.config';
/**
 * Default Export
 */
export const installationService = {
    details,
    getHistories,
    isDatapatchInstalledInContainer
};
/**
 * Installation history of application
 * 
 * @param {*} id 
 */
async function getHistories() {
    const uri = "/api/secured/v1/katappult/versionHistory";
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function details(id) {
    const uri = "/api/secured/v1/katappult/versionHistory/byId?entityId=" + id;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function isDatapatchInstalledInContainer(moduleName, containerPath){
	const uri = "/api/secured/v1/katappult/versionHistory/isDatapatchInstalledInContainer?buildModuleName=" + moduleName + "&containerPath=" + containerPath;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}