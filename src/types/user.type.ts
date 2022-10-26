export type User = {
	email: string;
  password: string;
	name: string;
	isPro?: boolean;
	avatarUrl?: string;
  favorites: string[];
};
