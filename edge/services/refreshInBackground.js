import { fetchFromOrigin } from './fetchFromOrigin.js';
import { cacheStore } from '../cache/cacheStore.js';
import { edgeCache } from '../cache/cacheInstance.js';

const inFlight = new Map();

/** @param {Record<string, string>} [fwd] Same forwarding headers used for the stale entry's client request */
export async function refreshInBackground(key, url, fwd = {}) {
    if (inFlight.has(key)) return;

    const promise = (async () => {
        try {
            console.log("Refreshing cache... in the background...");
            const response = await fetchFromOrigin(url, fwd);
            cacheStore(edgeCache, key, response);
        } catch (err) {
            console.error("Background refresh failed:", err);
        }
    })();

    inFlight.set(key, promise);
}
