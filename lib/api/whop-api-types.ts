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

export type WhopAuthorizedUserResponse = {
  role: string;
  permission_level: number;
  company: string;
};

export type WhopUserMembershipResponse = {
  id: string;
  created_at: number;
  access_pass: string;
  user: string;
  plan: string;
  status:
    | "drafted"
    | "trialing"
    | "active"
    | "past_due"
    | "completed"
    | "canceled"
    | "expired"
    | "unresolved";
  license_key: string;
  metadata: object;
  valid: boolean;
  quantity: number;
  renewal_period_start: number;
  renewal_period_end: number;
  wallet_address: string;
  custom_fields_responses: object;
}[];

export type WhopUserCompanies = WhopCompanyResponse[];

export type WhopExperienceResponse = {
  id: string;
  name: string;
  description: string;
  properties: object;
  access_passes: string[];
  experience_type:
    | "discord"
    | "software"
    | "content"
    | "custom"
    | "proxy"
    | "native_content"
    | "app"
    | "zentask"
    | "coffeecard"
    | "courses"
    | "link"
    | "file";
};

export type PaginatedResponse<T> = {
  pagination: { current_page: number; total_page: number; total_count: number };
  data: T[];
};
