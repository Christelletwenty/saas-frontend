export type LoginPayload = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  email: string;
  name?: string;
};

export type LoginResponse = {
  token: string;
  user?: User;
};

export type ProfileResponse = {
  user: User;
};
