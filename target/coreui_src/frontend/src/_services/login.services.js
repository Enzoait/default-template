import {_doPost, _doGet, buildURLQuery, API_ROOT, _doPostWithoutResponse} from './utils/services.config';

export const loginService = {
    login,
    logout,
    loginAsAnon,
    postLogin,
    switchUserContext
};
/**
 * Login to remote server
 */
function login(formdata) {
    const url = `${API_ROOT}/api/anon/v1/katappult/security/auth/login?source=js`;
    let bodyson = "{'username': '".concat(formdata.login)
        .concat("',").concat("'password': '").concat(formdata.password)
        .concat("'}");
    return _doPostWithoutResponse(url, bodyson);
}
function loginAsAnon() {
    const url = `${API_ROOT}/api/anon/v1/katappult/security/auth/login`;
    let bodyson = "{'username': '".concat('epanon')
        .concat("',").concat("'password': '").concat('epadmin').concat("'}");
    return _doPostWithoutResponse(url, bodyson);
}
/**
 * Logout
 */
function logout() {
    const url = `${API_ROOT}/api/secured/v1/katappult/security/auth/logout`;
    return _doPost(url);
}
/**
* With authorization because in some cases,
* authorization is not in local storage yet
*/
async function postLogin(){
	const url = `${API_ROOT}/api/secured/v1/katappult/security/auth/postlogin`;
	return _doGet(url);
}

async function switchUserContext(containerId){
    const url = `${API_ROOT}/api/secured/v1/katappult/security/auth/switchUserContext?containerId=${containerId}`;
    return _doGet(url);
}
