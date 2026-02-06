export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginData = {
  user: User;
  token: string;
};

export type RegisterData = {
  user: User;
  token: string;
};

export type ProfileData = {
  user: User;
};

export type UpdateUserProfilePayload = {
  name?: string;
  email?: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
