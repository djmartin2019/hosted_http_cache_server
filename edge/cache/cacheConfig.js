export function cacheConfig(cachedData) {
    return {
        statusCode: cachedData.statusCode,
        headers: {
            ...cachedData.headers,
            "X-Cache": "HIT"
        },
        body: cachedData.body
    };
}
