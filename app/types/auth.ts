export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
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

export type RegisterResponse = {
  token?: string;
  user?: User;
  message?: string;
};

export type ProfileResponse = {
  user: User;
};
