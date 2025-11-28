export type XAccountConnection = {
  handle: string;
  displayName: string;
  profileImage: string;
  profileUrl: string;
  connectedAt: string;
};

export type ExpertProfile = {
  id: string;
  name: string;
  title: string;
  expertise: string;
  price: number; 
  bio: string;
  avatar?: string | null;
  bannerImage?: string | null;
  rating?: number;
  reviews?: number;
  xAccount?: XAccountConnection | null;
};

