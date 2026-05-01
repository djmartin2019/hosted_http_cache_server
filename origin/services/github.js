export async function getUserData(username) {
    const res = await fetch(`http://api.github.com/users/${username}`);

    if (!res.ok) {
        throw new Error("GitHub API error");
    }

    return res.json();
}
