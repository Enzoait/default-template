import {commons} from "_helpers/commons";
import packageJson from '../../../package.json';

export const backendRootContext = process.env.REACT_APP_CONTEXT_ROOT;
const proxyURL = process.env.REACT_APP_PROXY_URL;
const hostname = window && window.location && window.location.hostname;
const port = window && window.location && window.location.port;
const origin = window && window.location && window.location.origin;

let API_ROOTV;
if (proxyURL) {
    API_ROOTV = proxyURL;
} else {
    if (/^localhost/.test(hostname) && port && (port === '3000' || port === '3001')) {
        if (port === '3000') {
            API_ROOTV = backendRootContext
                ? `http://${hostname}:8080/${backendRootContext}`
                : `http://${hostname}:8080`;
        }

        if (port === '3001') {
            API_ROOTV = backendRootContext
                ? `http://${hostname}:8081/${backendRootContext}`
                : `http://${hostname}:8081`;
        }

    } else {
        API_ROOTV = backendRootContext
            ? `${origin}/${backendRootContext}`
            : `${origin}`
    }
}

export const API_ROOT = API_ROOTV;
/*------------------------------------------------------------------------------------------------
*
* URI PROCESSOR
*
*------------------------------------------------------------------------------------------------*/
/**
 * Usage buildURLQuery({name: 'x', gender: 'y'});
 * ==> name=x&gender=y
 */
export const buildURLQuery = params => {
    return Object.keys(params)
        .map(k => `${k}=${encodeURI(params[k])}`)
        .join('&');
};
/*------------------------------------------------------------------------------------------------
 *
 * POST QUERY ROOT
 *
 *------------------------------------------------------------------------------------------------*/
/**
 * Constructs a default POST query.
 *
 * @param {*} url Full URL
 * @param {*} data Data to post
 */
export const _doPost = async function (url, data, options) {
    let finalurl = url.replace(":containerId", '_replace_this_');
    if (data) {
        return fetch(appendAccessToken(finalurl), {
            timeout: options && options.timeout ? options.timeout : 15000,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': commons.authorizationCookie()
            },
            body: data,
        }).then(response => {
            handleJWTError(response);
            return response.json();
        })

    } else {
        return fetch(appendAccessToken(finalurl), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': commons.authorizationCookie()
            },
        }).then(response => {
            handleJWTError(response);
            return response.json();
        })
    }
}
/**
 * Constructs a default POST query.
 *
 * @param {*} url Full URL
 * @param {*} data Data to post
 */
export const _doPostMp = async function (url, data, options) {
    let finalurl = url.replace(":containerId", '_replace_this_');
    if (data) {
        return fetch(appendAccessToken(finalurl), {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Authorization': commons.authorizationCookie()
            },
            body: data,
        }).then(response => {
            handleJWTError(response);
            return response.json();
        })
    }
}

export const _doPostWithoutResponse = async function (url, data, options) {
    let finalurl = url.replace(":containerId", '_replace_this_');
    if (data) {
        return fetch(appendAccessToken(finalurl), {
            timeout: options && options.timeout ? options.timeout : 15000,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': commons.authorizationCookie()
            },
            body: data,
        });

    } else {
        return fetch(appendAccessToken(finalurl), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': commons.authorizationCookie()
            },
        })
    }
}

/*------------------------------------------------------------------------------------------------
*
* GET QUERY ROOT
*
*------------------------------------------------------------------------------------------------*/
/**
 * Constructs a GET query.
 *
 * @param {*} url Full URL
 */
export const _doGet = async function (url, addSessionId, authorization, options) {
    let finalurl = url.replace(":containerId", '_replace_this_');
    finalurl = appendAccessToken(finalurl);

    let response = await fetch(finalurl, {
        timeout: options && options.timeout ? options.timeout : 15000,
        method: "GET",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authorization ? authorization : commons.authorizationCookie()
        },
    }).then(response => {
        return response;
    }).catch(error => {
        if(error instanceof  TypeError){
            forwardToLoginPage()
        }
    })

    handleJWTError(response);

    let json;
    if (response.status === 200) {
        json = await response.json();
    } else if (response.status === 204) {
        json = {'error': '204'};
    } else if (response && response.status === 500) {
        json = {'error': '500'};
    }

    return json;
}

export const _doGetText = async function (url) {
    let finalurl = url.replace(":containerId", '_replace_this_');
    return fetch(appendAccessToken(finalurl), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': commons.authorizationCookie()
        },
    }).then(response => {
        handleJWTError(response);
        return response.text();
    })
}

export const _doGetImage = async function (url) {
    let finalurl = url.replace(":containerId", '_replace_this_');
    let response = await fetch(appendAccessToken(finalurl), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': commons.authorizationCookie()
        },
    })
        .then(response => {
            if (response.status === 200) {
                return response;
            }
            return null;
        })

    if (response === null) return response;
    handleJWTError(response)

    let text = await response.text()
    let img = new Buffer(text, "binary").toString();
    let image = btoa(
        new Uint8Array(text)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:image/png;base64,${img}`;
}

export const _doGetBlob = async function (url) {
    let finalurl = url.replace(":containerId", '_replace_this_');
    return fetch(appendAccessToken(finalurl), {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/octet-stream',
            'Authorization': commons.authorizationCookie()
        },
    })
        .then(response => {
            if(response.status != 200) return null;

            handleJWTError(response);
            return response.blob();
        })
}

export const _doPut = async function (url, data, options) {
    let finalurl = url.replace(":containerId", '_replace_this_');
    if (data) {
        return fetch(appendAccessToken(finalurl), {
            timeout: options && options.timeout ? options.timeout : 15000,
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': commons.authorizationCookie()
            },
            body: JSON.stringify(data),
        }).then(response => {
            handleJWTError(response)
            return response.json()
        })
    } else {
        return fetch(appendAccessToken(finalurl), {
            timeout: options && options.timeout ? options.timeout : 15000,
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': commons.authorizationCookie()
            },
        }).then(response => {
            handleJWTError(response)
            return response.json()
        })
    }
}
export const _doDelete = async function (url, data, options) {
    let finalurl = url.replace(":containerId", '_replace_this_');
    if (data) {
        return fetch(appendAccessToken(finalurl), {
            timeout: options && options.timeout ? options.timeout : 15000,
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': commons.authorizationCookie()
            },
            body: JSON.stringify(data),
        }).then(response => {
            handleJWTError(response)
            return response.json()
        })
    } else {
        return fetch(appendAccessToken(finalurl), {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': commons.authorizationCookie()
            },
        }).then(response => {
            handleJWTError(response)
            return response.json()
        })
    }
}

function appendAccessToken(url) {
    let finalUrl = url;
    if (url.includes('/api/anon/v1/katappult/security/auth/login')) finalUrl = url;
    if (url.includes('/v1/anon/auth/lostPassword')) finalUrl = url;
    if (url.includes('/v1/anon/auth/resetPassword')) finalUrl = url;
    if (url.includes('?')) {
        finalUrl = url + '&lang=fr';
    } else {
        finalUrl = url + '?lang=fr';
    }

    return finalUrl.replace(/([^:])(\/{2,})/g, "$1/");
    //abc.replace(/([^:]\/)\/+/g, "$1");
}

async function handleApplicationVersion(response, url) {
    let token = response?.headers?.get('X-Application-Version');
    const version = packageJson.version;

    let isProd = false;
    let isLocalhost = /^localhost/.test(hostname);

    if(!isLocalhost) {
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            // dev code
            isProd = false;
        } else {
            // production code
            isProd = true;
        }
    }

    if(isProd){
        if (!token || !version || token !== version) {
           await refreshCacheAndReload();
        }
    }
}

function handleJWTError(response) {
    if (response && (response === 511 || response === '511' || response.status === 511)) {
        forwardToLoginPage();
    }
}

function forwardToLoginPage() {
    commons.katappult_core_logout();
    // this will reload the application and web app resources
    let configuredLoginURL = process.env.REACT_APP_CLIENT_LOGIN_URL;
    window.location.href = configuredLoginURL;
}

const refreshCacheAndReload = async () => {
    try {
        if (window?.caches) {
            const { caches } = window;
            const cacheNames = await caches.keys();
            for (const cacheName of cacheNames) {
                await caches.delete(cacheName);
            }

            console.log('The cache has been deleted.');
        }

        //window.location.reload(true);
    } catch (error) {
        console. log('An error occurred while deleting the cache.', true);
        console.log(error, true);
    }
};
