export async function fetchFromOrigin(originUrl) {
    const originRes = await fetch(originUrl);

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
