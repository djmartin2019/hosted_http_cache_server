/**
 * Values from the client-facing request so origin can build public absolute URLs
 * (origin sees Host: origin:4000 on internal fetch).
 */
export function forwardingHeaders(req) {
    const protoRaw = req.headers['x-forwarded-proto'];
    const hostRaw = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = typeof protoRaw === 'string' ? protoRaw.split(',')[0].trim() : '';
    const host = typeof hostRaw === 'string' ? hostRaw.split(',')[0].trim() : '';
    const headers = {};
    if (host) headers['X-Forwarded-Host'] = host;
    if (proto) headers['X-Forwarded-Proto'] = proto;
    return headers;
}
