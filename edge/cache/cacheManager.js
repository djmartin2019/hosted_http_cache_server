import { cacheKey } from './cacheKey.js';
import { cacheConfig } from './cacheConfig.js';
import { refreshInBackground } from '../services/refreshInBackground.js';
import { fetchFromOrigin } from '../services/fetchFromOrigin.js';
import { cacheStore } from './cacheStore.js';
import { edgeCache } from './cacheInstance.js';
import { forwardingHeaders } from './forwardingHeaders.js';

const originBase = (process.env.ORIGIN_URL || 'http://localhost:4000').replace(/\/$/, '');

export async function cacheManager(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const originURL = `${originBase}${url.pathname}${url.search}`;

    const key = cacheKey(req.method, originURL);
    const fwd = forwardingHeaders(req);

    const cached = edgeCache.get(key);

    if (cached) {
       if (cached.expiry > Date.now()) {
           console.log("Edge HIT: cache not expired");
           return cacheConfig(cached);
        } else {
            console.log("Edge HIT: stale");
            const stale = cacheConfig(cached);
            refreshInBackground(key, originURL, fwd);
            return stale;
        }
    }

    console.log("CACHE MISS");
    const response = await fetchFromOrigin(originURL, fwd);
    cacheStore(edgeCache, key, response);

    return {
        ...response,
        headers: {
            ...response.headers,
            "X-Cache": "MISS"
        }
    };
}
