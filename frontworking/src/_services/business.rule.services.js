import { _doGet, _doPost, _doDelete, buildURLQuery, API_ROOT } from './utils/services.config';
/**
 * Default Export
 */
export const businessRulesService = {
    getAllBusinessEvent,
    getApplicableRules,
    getById,
    activate,
    desactivate,
    deleteRule,
    setOrder,
    getAllBusinessClass,
    getAllBusinessTypes,
	businessRuleClasses,
	getAllBusinessRules,
	createBusinessRule,
	selectableRootTypes,
	selectableEntities,
	eventsOf,
	applicableRulesOnBusinessClass,
	allTypesOfBusinessClass
}


async function allTypesOfBusinessClass(businessClass, containerId){
	const uri = '/api/secured/v1/katappult/businessRules/allTypesOfBusinessClass?containerId=' + containerId + '&businessClass=' + businessClass;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

async function eventsOf(businessClass, containerId){
	const uri = '/api/secured/v1/katappult/businessRules/eventsOf?containerId=' + containerId + '&businessClass=' + businessClass;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

async function applicableRulesOnBusinessClass(businessClass, type, containerId){
	const uri = '/api/secured/v1/katappult/businessRules/businessClass/applicableRules?containerId=' + containerId + '&businessClass=' + businessClass + '&type=' + type;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

async function selectableEntities(containerId){
	const uri = '/api/secured/v1/katappult/businessRules/selectableEntities?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

async function createBusinessRule(form, containerId){
	const uri = '/api/secured/v1/katappult/businessRules?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doPost(url, JSON.stringify(form));
}
async function getAllBusinessRules(page, pageSize, containerId, searchTermFilterForIdentifier){
	const uri = '/api/secured/v1/katappult/businessRules/list?containerId=' + containerId + '&page=' + page + '&pageSize=' + pageSize + '&searchTermFilterForIdentifier=' + searchTermFilterForIdentifier;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

async function businessRuleClasses(page, pageSize, containerId){
	const uri = '/api/secured/v1/katappult/businessRules/businessRuleClasses?containerId=' + containerId + '&page=' + page + '&pageSize=' + pageSize;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

async function deleteRule(businessRuleId, containerId){
	const uri = '/api/secured/v1/katappult/businessRules/delete?containerId=' + containerId + '&businessRuleId=' + businessRuleId;
	const url = `${API_ROOT}` + uri;
    return _doDelete(url);
}
async function setOrder(businessRuleId, formData, containerId){
	const uri = '/api/secured/v1/katappult/businessRules/setOrder?containerId=' + containerId + '&businessRuleId=' + businessRuleId;
	const url = `${API_ROOT}` + uri;
    return _doPost(url, JSON.stringify(formData));
}
async function activate(businessRuleId, containerId){
	const uri = '/api/secured/v1/katappult/businessRules/activate?containerId=' + containerId + '&businessRuleId=' + businessRuleId;
	const url = `${API_ROOT}` + uri;
    return _doPost(url);
}
async function desactivate(businessRuleId, containerId){
	const uri = '/api/secured/v1/katappult/businessRules/desactivate?containerId=' + containerId + '&businessRuleId=' + businessRuleId;
	const url = `${API_ROOT}` + uri;
    return _doPost(url);
}
/**
 * Get all business events in application
 */
async function getById(businessRuleId, containerId){
	const uri = '/api/secured/v1/katappult/businessRules/byId?containerId=' + containerId + '&businessRuleId=' + businessRuleId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * @returns
 */
async function getAllBusinessEvent(containerId){
	const uri = '/api/secured/v1/katappult/businessRules/businessEvents?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * @returns
 */
async function getAllBusinessClass(containerId){
	const uri = '/api/secured/v1/katappult/businessRules/businessRuleClasses?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function selectableRootTypes(containerId){
	const uri = '/api/secured/v1/katappult/businessRules/selectableRootTypes?containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

async function getAllBusinessTypes(typeId, containerId){
	const uri = "/api/secured/v1/katappult/businessRules/businessTypes?&typeId=" + typeId + '&containerId=' + containerId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
/**
 * Get applicable rule.
 *
 * @param formData
 * @returns
 */
async function getApplicableRules(formData, containerId){
	if(formData.eventKey === undefined) formData.eventKey = ''

	let p = buildURLQuery(formData);
	const uri = "/api/secured/v1/katappult/businessRules/applicableRules?".concat(p).concat('&containerId=' + containerId);
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
