import { getUserData } from './../services/github.js';

export async function handleDevRoute(url) {
    const username = url.pathname.split("/")[2];

    try {
        const userData = await getUserData(username);

        const responseBody = {
            username: userData.login,
            avatar_url: userData.avatar_url,
            followers: userData.followers,
            following: userData.following,
            public_repos: userData.public_repos,
            creation_date: calculateAccountAge(userData.created_at)
        };

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(responseBody)
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: `Failed to fetch user data: ${err}` })
        };
    }
}

function calculateAccountAge(creation_date) {
    const created = new Date(creation_date);
    const now = new Date();
    return ((now - created) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
}
