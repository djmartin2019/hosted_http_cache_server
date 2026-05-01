export async function fetchFromOrigin(originUrl) {
    const originRes = await fetch (originUrl);

    console.log("ORIGIN CALLED");

    const body = await originRes.text();

    return {
        statusCode: originRes.status,
        headers: {
            "Content-Type": originRes.headers.get("content-type") || "application/json"
        },
        body
    };
}
