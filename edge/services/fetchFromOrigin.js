/**
 * @param {string} originUrl
 * @param {Record<string, string>} [fwd] Headers from the client-facing request (e.g. X-Forwarded-Host).
 */
export async function fetchFromOrigin(originUrl, fwd = {}) {
    const fwdHeaders = {};
    if (fwd['X-Forwarded-Host']) fwdHeaders['X-Forwarded-Host'] = fwd['X-Forwarded-Host'];
    if (fwd['X-Forwarded-Proto']) fwdHeaders['X-Forwarded-Proto'] = fwd['X-Forwarded-Proto'];

    const originRes = await fetch(originUrl, {
        headers: Object.keys(fwdHeaders).length ? fwdHeaders : undefined
    });

    console.log('ORIGIN CALLED');

    const buf = Buffer.from(await originRes.arrayBuffer());

    const headers = {
        'Content-Type': originRes.headers.get('content-type') || 'application/octet-stream'
    };
    const cc = originRes.headers.get('cache-control');
    if (cc) {
        headers['Cache-Control'] = cc;
    }

    return {
        statusCode: originRes.status,
        headers,
        body: buf
    };
}
