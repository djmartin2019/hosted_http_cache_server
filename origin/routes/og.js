import { getUserData } from '../services/github.js';
import { renderOgPng } from '../og/render.js';

/** 1×1 transparent PNG — last resort if resvg/satori fails (avoids HTTP 500). */
const MIN_PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
);

async function pngOrFallback(user, avatarDataUrl) {
    try {
        return await renderOgPng(user, avatarDataUrl);
    } catch (e) {
        console.error('[og] renderOgPng failed', e);
        try {
            return await renderOgPng(null, null);
        } catch (e2) {
            console.error('[og] renderOgPng(null) failed', e2);
            return MIN_PNG;
        }
    }
}

export async function handleOgRoute(url) {
    const seg = url.pathname.split('/').filter(Boolean)[1];
    if (!seg || !seg.toLowerCase().endsWith('.png')) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            body: 'Bad Request'
        };
    }
    const username = decodeURIComponent(seg.replace(/\.png$/i, ''));

    try {
        const user = await getUserData(username);
        let avatarDataUrl = null;
        if (user.avatar_url) {
            const ar = await fetch(user.avatar_url, {
                headers: { 'User-Agent': 'http-edge-cache-v2-origin/1.0' }
            });
            if (ar.ok) {
                const buf = Buffer.from(await ar.arrayBuffer());
                const ct = ar.headers.get('content-type') || 'image/jpeg';
                avatarDataUrl = `data:${ct};base64,${buf.toString('base64')}`;
            }
        }
        const png = await pngOrFallback(user, avatarDataUrl);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=600'
            },
            body: png
        };
    } catch (e) {
        console.error('[og] handler error', e?.message || e);
        const png = await pngOrFallback(null, null);
        return {
            statusCode: 404,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=120'
            },
            body: png
        };
    }
}
