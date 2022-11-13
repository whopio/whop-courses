export type WhopAccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope?: string;
  created_at: number;
};

export async function codeToAccessToken(
  code: string
): Promise<WhopAccessTokenResponse> {
  const data = await fetch(`${process.env.WHOP_API_URL}/v3/oauth/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.WHOP_CLIENT_ID,
      client_secret: process.env.WHOP_CLIENT_SECRET,
      code,
      redirect_uri: process.env.WHOP_REDIRECT_URI,
    }),
  }).then((r) => r.json());
  if (!data.access_token) throw Error("Failed to get access token");
  return data;
}
