import { getUserData } from '../services/github.js';
import { renderOgPng } from '../og/render.js';

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
            const ar = await fetch(user.avatar_url);
            if (ar.ok) {
                const buf = Buffer.from(await ar.arrayBuffer());
                const ct = ar.headers.get('content-type') || 'image/jpeg';
                avatarDataUrl = `data:${ct};base64,${buf.toString('base64')}`;
            }
        }
        const png = await renderOgPng(user, avatarDataUrl);
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=600'
            },
            body: png
        };
    } catch {
        const png = await renderOgPng(null, null);
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
