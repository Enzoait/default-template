import { API_ROOT } from './utils/services.config';

export const heartbeatService = {
    pingServer
}

/**
 * Server of heartbeat, checks if remote service is reachable.
 */
async function pingServer() {
    try {
        const response = await fetch(`${API_ROOT}/api/anon/v1/katappult/ping`);
        if (!response.ok) {
            console.error("Remote backend seems to be unreachable!");
            console.error(response);
        }
        else {
            let json = response.json();
            return json;
        }
    }
    catch (error) {
        console.log(error);
    }
}
