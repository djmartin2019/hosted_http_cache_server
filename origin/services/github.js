const UA = 'http-edge-cache-v2-origin/1.0';

export async function getUserData(username) {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: {
            Accept: 'application/vnd.github+json',
            'User-Agent': UA
        }
    });

    if (!res.ok) {
        throw new Error('GitHub API error');
    }

    return res.json();
}
