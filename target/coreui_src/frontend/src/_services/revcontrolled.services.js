import {_doGet, buildURLQuery, API_ROOT, _doPost} from './utils/services.config';

/**
 * Rev controlled
 */
export const revControlledService = {
    allIterationsOf,
	allIterationsOfversion,
    allVersionsOf,
    exactIterationAndVersion,
	exactIterationAndVersionIdOnly,
    latestIterationOf,
	latestIterationOfIdOnly,
	revise,
}
function revise(revControlledId, containerId){
	const uri = '/api/secured/v1/katappult/rc/revise?containerId=' + containerId + "&revControlledId=" + revControlledId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url);
}
/**
 * All iterations of a revision controlled.
 *
 * @param revControlledId
 * @returns
 */
async function allIterationsOf(revControlledId, containerId) {
	const uri = '/api/secured/v1/katappult/rc/iterations?' + 'containerId=' + containerId + '&revControlledId=' + revControlledId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function allIterationsOfversion(revControlledId, versionId, containerId) {
	const uri = '/api/secured/v1/katappult/rc/iterationsOfVersion?' + 'containerId=' + containerId + '&revControlledId=' + revControlledId + '&versionNumber=' +versionId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

/**
 * All versions of a revision controlled.
 *
 * @param revControlledId
 * @returns
 */
async function allVersionsOf(revControlledId, containerId) {
	const uri = '/api/secured/v1/katappult/rc/versions?' + 'containerId=' + containerId + '&revControlledId=' + revControlledId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function exactIterationAndVersion(revControlledId, version, iteration, containerId){
	const uri = '/api/secured/v1/katappult/rc/exactVersion/exactIteration?containerId=' + containerId + '&revControlledId=' + revControlledId + '&versionNumber=' + version + '&iterationNumber=' + iteration + "&idOnly=false";
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function latestIterationOf(revControlledId, containerId){
	const uri = '/api/secured/v1/katappult/rc/latest?' + 'containerId=' + containerId + '&revControlledId=' + revControlledId + "&idOnly=false";
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

async function exactIterationAndVersionIdOnly(revControlledId, version, iteration, containerId){
	const uri = '/api/secured/v1/katappult/rc/exactVersion/exactIteration?containerId=' + containerId + '&revControlledId=' + revControlledId + '&versionNumber=' + version + '&iterationNumber=' + iteration + "&idOnly=true";
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
async function latestIterationOfIdOnly(revControlledId, containerId){
	const uri = '/api/secured/v1/katappult/rc/latest?' + 'containerId=' + containerId + '&revControlledId=' + revControlledId + "&idOnly=true";
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
