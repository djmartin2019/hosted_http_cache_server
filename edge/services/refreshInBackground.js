import { fetchFromOrigin } from './fetchFromOrigin.js';
import { cacheStore } from '../cache/cacheStore.js';

const inFlight = new Map();

export async function refreshInBackground(key, url) {
    if (inFlight.has(key)) return;

    const promise = (async () => {
        try {
            console.log("Refreshing cache... in the background...");
            const response = await fetchFromOrigin(url);
            cacheStore(cache, key, response);
        } catch (err) {
            console.error("Background refresh failed:", err);
        }
    })();

    inFlight.set(key, promise);
}
