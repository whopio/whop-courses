export type WhopMeResponse = {
  id: string;
  username: string;
  email: string | null;
  profile_pic_url: string;
  social_accounts: { service: string; username: string; id: number }[];
};

export type WhopAccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope?: string;
  created_at: number;
};

export type WhopCompanyResponse = {
  id: string;
  title: string;
  image_url: string;
  hostname: string;
  route: string;
};

export type WhopCompanyByRouteResponse = {
  title: string;
  route: string;
  tag: string;
  image_url: string;
  header_image_url: string;
  description: string;
  shortened_description: string;
};

export type WhopUserCompanies = {
  id: string;
  title: string;
  route: string;
  image_url: string;
  hostname: string;
}[];
