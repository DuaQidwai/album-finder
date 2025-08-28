export async function handler() {
  const client_id = process.env.VITE_CLIENT_ID;
  const client_secret = process.env.VITE_CLIENT_SECRET;

  const authParams = new URLSearchParams();
  authParams.append("grant_type", "client_credentials");

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: authParams,
    });

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch token", details: err }),
    };
  }
}
