import { _doGet, API_ROOT } from './utils/services.config';
/**
 * Default Export
 */
export const teamTemplateService = {
    getById,
};
/**
 * Get a team template by its identifier.
 *
 * @param {*} id
 */
async function getById(id, containerId) {
    const uri = "/api/secured/v1/katappult/teamTemplate/byId?id=" + id + '&containerId=' + containerId;
    const url = `${API_ROOT}` + uri;
    return _doGet(url);
}
