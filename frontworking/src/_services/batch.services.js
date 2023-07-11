import { _doGet, _doPostMp, API_ROOT,_doGetText, _doPut, buildURLQuery } from './utils/services.config';
/**
 * Default Export
 */
export const batchService = {
    getJobTypes,
    batchLoad,
    batchExport,
    jobCommands,
    getAllJobs,
    cancel,
    downloadMasterFile,
    downloadLogFile,
    getById,
	importableTypes
};

async function importableTypes(containerId){
	const uri = "/api/secured/v1/katappult/batch/importableTypes?containerId=" + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

async function getById(jobId, containerId){
	const uri = "/api/secured/v1/katappult/batch/byId?containerId=" + containerId + "&id=" + jobId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Get job types for a job
 */
async function cancel(jobId, containerId){
	const uri = '/api/secured/v1/katappult/batch/jobs/cancel?containerId=' + containerId + "&id=" + jobId;
	const url = `${API_ROOT}` + uri;
    return _doPut(url);
}
async function downloadMasterFile(jobId, containerId) {
	let uri = '/api/secured/v1/katappult/batch/jobs/masterFile?containerId=' + containerId + "&id=" + jobId
    let url = `${API_ROOT}` + uri
	return _doGetText(url)
}
async function downloadLogFile(jobId, containerId) {
	let uri = '/api/secured/v1/katappult/batch/jobs/logFile?containerId=' + containerId + "&id=" + jobId
    let url = `${API_ROOT}` + uri
	return _doGetText(url)
}
/**
 * Get all jobs
 */
async function getAllJobs(params, containerId){
	params.includeParentsItem = false;
	let p = buildURLQuery(params);
	const uri = "/api/secured/v1/katappult/batch/jobs?".concat(p).concat("&containerId=").concat(containerId);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Get job types for a job
 */
async function getJobTypes(job, containerId){
	const uri = "/api/secured/v1/katappult/batch/jobTypes?forJob=".concat(job).concat("&containerId=").concat(containerId);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Get job commands for a job mapping
 */
async function jobCommands(forMapping, containerId){
	const uri = "/api/secured/v1/katappult/batch/jobCommands?forMapping=".concat(forMapping).concat("&containerId=").concat(containerId);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Launch a batch load job
 *
 * @param formData
 * @returns
 */
async function batchLoad(formData){
	let uri = '/api/secured/v1/katappult/batch/load'
    let url = `${API_ROOT}` + uri
	return _doPostMp(url, formData)
}
/**
 * Launch a batch export job
 *
 * @param formData
 * @returns
 */
async function batchExport(formData){
	let uri = '/api/secured/v1/katappult/batch/export2'
	let url = `${API_ROOT}` + uri
	formData['output.file.name'] = 'export.txt'
	return _doPostMp(url, JSON.stringify(formData))
}
