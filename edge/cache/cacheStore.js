import { ttlManager } from '../services/ttlManager.js';

export function cacheStore(cache, key, response) {
    cache.set(key, {
        ...response,
        expiry: ttlManager()
    });
}
