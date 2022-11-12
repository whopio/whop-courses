export type MeResponse = {
  id: string;
  username: string;
  email: string;
  profile_pic_url: string;
  social_accounts: { service: string; username: string; id: number }[];
};

export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
};

export type CompanyResponse = {
  id: string;
  title: string;
  image_url: string;
  hostname: string;
};

export async function codeToAccessToken(
  code: string
): Promise<AccessTokenResponse> {
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

export async function getMe(accessToken: string): Promise<MeResponse> {
  const me = await fetch(`${process.env.WHOP_API_URL}/v2/me`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }).then((r) => r.json());
  if (me.error) throw Error("Failed fetch me");
  return me;
}

export async function getCompany(id: string): Promise<CompanyResponse> {
  const company = await fetch(`${process.env.WHOP_API_URL}/v2/company`, {
    headers: {
      "Whop-Company": id,
      authorization: `Bearer ${process.env.WHOP_API_KEY}`,
    },
  }).then((r) => r.json());
  if (company.error) throw Error("Failed fetch company");
  return company;
}
