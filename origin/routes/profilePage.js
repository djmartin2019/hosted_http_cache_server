import { getUserData } from '../services/github.js';
import { getIndexBase, getIndexWithMeta } from '../services/htmlTemplate.js';

function requestBaseUrl(req) {
    const proto = (req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
    const host = (req.headers['x-forwarded-host'] || req.headers.host || 'localhost').split(',')[0].trim();
    return `${proto}://${host}`;
}

export async function handleProfilePage(url, req) {
    const parts = url.pathname.split('/').filter(Boolean);
    const raw = parts[1] || '';
    const username = raw ? decodeURIComponent(raw) : '';

    if (!username) {
        return {
            statusCode: 302,
            headers: { Location: '/' },
            body: ''
        };
    }

    try {
        const user = await getUserData(username);
        const age = ((Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
        const description = `${user.public_repos} public repos · ${user.followers} followers · ${user.following} following · ${age} yrs on GitHub`;
        const baseUrl = requestBaseUrl(req);
        const loginEnc = encodeURIComponent(user.login);
        const html = getIndexWithMeta({
            title: `@${user.login} · GitHub card`,
            description,
            ogImage: `${baseUrl}/og/${loginEnc}.png`,
            canonical: `${baseUrl}/u/${loginEnc}`
        });
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=300'
            },
            body: html
        };
    } catch {
        const html = getIndexBase();
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            body: html
        };
    }
}
