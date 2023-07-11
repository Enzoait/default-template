import { _doPost,_doGet,_doPut, API_ROOT, _doDelete, buildURLQuery } from './utils/services.config';

export const accountService = {
    lock,
	unlock,
	resetPassword,
	updatePassword,
	lostPassword,
	updateLostPasswordByUser,
	accountDetails,
	accountOfParty,
	updatePersonProfile,
	updateOrgProfile,
	activateAccount,
	registerPersonWithAccount,
	registerOrgWithAccount,
	registerPersonWithAccountAnon,
	registerOrgWithAccountAnon,
	containersMembership,
	isUserInContainer,
	addContainerMembership,
	removeContainerMembership,
	ownerType,
	ownersName,
	isValidAccountLockToken,
	membersByLoginLikeInWholePlatform
}
function isValidAccountLockToken(token) {
	const uri = '/api/anon/v1/katappult/security/auth/isValidAccountLockToken?token=' + token;
	let url = `${API_ROOT}` + uri
	return _doGet(url)
}
/**
 * Register a new user with account
 *
 * @param formData
 * @returns
 */
function registerPersonWithAccount(formData){
	const uri = '/api/secured/v1/katappult/person/create';
    let url = `${API_ROOT}` + uri
	return _doPost(url, JSON.stringify(formData))
}
function registerPersonWithAccountAnon(formData){
	const uri = '/katappult/people/v1/anon/api/person/register';
    let url = `${API_ROOT}` + uri
	return _doPost(url, JSON.stringify(formData))
}
/**
 * Register a new org with account
 *
 * @param formData
 * @returns
 */
function registerOrgWithAccount(formData){
	const uri = '/api/secured/v1/katappult/organization/';
    let url = `${API_ROOT}` + uri
	return _doPost(url, JSON.stringify(formData))
}
function registerOrgWithAccountAnon(formData){
	const uri = '/api/secured/v1/katappult/organization/register/';
    let url = `${API_ROOT}` + uri
	return _doPost(url, JSON.stringify(formData))
}
/**
 * Activate an account.
 *
 * @param accountId
 * @param formData
 * @returns
 */
function activateAccount(login, formData, lockToken){
	const uri = '/katappult/security/inactive/auth/activateAccount?login=' + login;
  let url = `${API_ROOT}` + uri
	return _doPost(url, JSON.stringify(formData))
}
/**
 * Load an account with details of owner loaded in links.
 */
function accountDetails(accountId, containerId) {
	const uri = '/api/secured/v1/katappult/principals/account/details?containerId=' + containerId + '&accountId=' + accountId;
    let url = `${API_ROOT}` + uri
	return _doGet(url);
}
/**
 * Loads account of a party  with its details loaded in links.
 */
function accountOfParty(partyId, containerId) {
	let params = {partyId: partyId};
	let p = buildURLQuery(params);
	const uri = '/api/secured/v1/katappult/principals/account?containerId=' + containerId + '&' + p;
    let url = `${API_ROOT}` + uri
	return _doGet(url);
}
/**
 * Lock an account.
 *
 * @param {*} accountId
 */
function lock(accountId, containerId) {
	const uri = '/api/secured/v1/katappult/principals/account/lock?containerId=' + containerId + '&accountId=' + accountId;
    let url = `${API_ROOT}` + uri
	return _doPost(url);
}
/**
 * Unlock an account. Super admin can unlock user account without
 * lock token
 *
 * @param {*} accountId
 * @param {*} lockToken Mandatory if not superadmin
 */
function unlock(accountId, lockToken, containerId) {
	let params = {lockToken: lockToken ? lockToken : ''};
	let p = buildURLQuery(params);
    const uri = '/api/secured/v1/katappult/principals/account/unlock?containerId=' + containerId  + '&accountId=' + accountId + '&'.concat(p);
	let url = `${API_ROOT}` + uri
	return _doPost(url);
}
/**
 * Rest current password.
 *
 * @param {*} accountId
 */
function resetPassword(accountId, containerId) {
    const uri = '/api/secured/v1/katappult/principals/account/resetPassword?containerId=' + containerId + '&accountId=' + accountId;
	let url = `${API_ROOT}` + uri
	return _doPut(url);
}
/**
 * Update user password.
 *
 * @param {*} accountId
 * @param {*} formData
 */
function updatePassword(accountId, formData, containerId) {
    const uri = '/api/secured/v1/katappult/principals/account/updatePassword?containerId=' + containerId + '&accountId=' + accountId;
    let url = `${API_ROOT}` + uri
    return _doPut(url, formData);
}
/**
 * Send an email to user with its token.
 *
 * @param {*} accountId
 */
function lostPassword(login) {
    const uri = '/api/anon/v1/katappult/security/auth/lostPassword?login=' + login;
    let url = `${API_ROOT}` + uri
    return _doGet(url);
}
// by user, another reset is by admin
function updateLostPasswordByUser(lockToken, formdata) {
    const uri = '/api/anon/v1/katappult/security/auth/resetPassword?token=' + lockToken;
	let url = `${API_ROOT}` + uri
	return _doPut(url, formdata);
}
/**
 * Update profile.
 *
 * @param profileId
 * @param formData
 * @returns
 */
function updatePersonProfile(profileId, formData, containerId){
	const uri = '/api/secured/v1/katappult/person/update?containerId=' + containerId + '&id=' + profileId;
    let url = `${API_ROOT}` + uri
    return _doPut(url, formData);
}
/**
 * Update profile.
 *
 * @param profileId
 * @param formData
 * @returns
 */
function updateOrgProfile(profileId, formData, containerId){
	const uri = '/api/secured/v1/katappult/organization?containerId=' + containerId + '&id=' + profileId;
    let url = `${API_ROOT}` + uri
    return _doPut(url, formData);
}
/**
 * Get all container memberships of given user account.
 *
 * @param accountId
 * @returns
 */
function containersMembership(accountId, containerId){
	const uri = '/api/secured/v1/katappult/principals/account/containersMembership?containerId=' + containerId + '&accountId=' + accountId;
    let url = `${API_ROOT}` + uri
	return _doGet(url);
}
/**
 * Return true is the account is declared member in that container.
 *
 * @returns
 */
function isUserInContainer(accountId, containerId){
	const uri = '/api/secured/v1/katappult/principals/account/containersMembership/isMember?containerId=' + containerId + '&accountId=' + accountId;
    let url = `${API_ROOT}` + uri
	return _doGet(url);
}
/**
 * Add account as member of container.
 *
 * @param accountId
 * @param containerId
 * @returns
 */
function addContainerMembership(accountId, containerId){
	const uri = '/api/secured/v1/katappult/principals/account/containersMembership?containerId=' + containerId + '&accountId=' + accountId;
    let url = `${API_ROOT}` + uri
	return _doPost(url);
}
/**
 * Remove an account from container members
 *
 * @param accountId
 * @param containerId
 * @returns
 */
function removeContainerMembership(accountId, containerId){
	const uri = '/api/secured/v1/katappult/principals/account/containersMembership?containerId=' + containerId + '&accountId=' + accountId;
    let url = `${API_ROOT}` + uri
	return _doDelete(url);
}
/**
 * Returns the type of the owner.
 *
 * @param accoundId
 * @returns
 */
async function ownerType(accoundId, containerId){
	const uri = "/api/secured/v1/katappult/principals/account/ownerType?containerId=" + containerId + '&accountId=' + accoundId;
	const url = `${API_ROOT}` + uri;
    return _doGet(url);
}

async function ownersName(ownersName, containerId){
	const uri = '/api/secured/v1/katappult/principals/account/ownersName?ownersLogin=' + ownersName + '&containerId=' + containerId
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}

/**
 * Search given user in given container.
 *searchAccountByLoginLike
 * @returns
 */
async function membersByLoginLikeInWholePlatform(queryParams, containerId) {
	var p = buildURLQuery(queryParams);
	const uri = '/api/secured/v1/katappult/principals/account/membersByLoginLikeInWholePlatform/?'.concat(p + '&containerId=' + containerId);
	const url = `${API_ROOT}` + uri;
	return _doGet(url);
}
