export type getUserDetailReq = {
  userType: 'users' | 'organizations';
  id: string;
};

export type ProfileReq = {
  id: string;
  name: string;
  bio: string;
  description: string;
  email: string;
  phone: string;
  city: string;
  type: string;
  address: string;
  website: string;
  created_at: string;
  updated_at: string;
  social_causes: string[];
  followers: number;
  followings: number;
  country: string;
  wallet_address: string;
  impact_points: number;
  mission: string;
  culture: string;
  image: {
    id: string;
    identity_id: string;
    filename: string;
    url: string;
    created_at: string;
  };
  cover_image: {
    id: string;
    identity_id: string;
    filename: string;
    url: string;
    created_at: string;
  };
  mobile_country_code: string;
  created_by: string;
  shortname: string;
  old_id: number;
  status: string;
  search_tsv: string;
  other_party_id: string;
  other_party_title: string;
  other_party_url: string;
  geoname_id: string;
};