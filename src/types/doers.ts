export interface DoerType {
  image: string;
  name: string;
  active: boolean;
  rating: number;
  verifiedSince: string;
  skills: string[];
  location: string;
}

export type DoerCardProps = {
  image: string;
  name: string;
  active: boolean;
  rating: number;
  verifiedSince: string;
  skills: string[];
  location: string;
  onViewProfile: () => void;
};
