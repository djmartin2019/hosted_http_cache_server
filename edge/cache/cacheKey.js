export function cacheKey(request_method, request_url) {
    const key = `${request_method}:${request_url}`;
    return key
}
