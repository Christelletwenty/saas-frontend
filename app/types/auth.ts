export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
};

export type UpdateProfilePayload = {
  name?: string;
  email?: string;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type User = {
  id: number;
  email: string;
  name?: string;
  createdAd: string;
  updatedAt: string;
};

export type ApiSuccess<TData> = {
  success?: boolean;
  message?: string;
  data: TData;
};

export type ApiError = {
  message: string;
  code?: string;
  errors?: Array<{ field?: string; message: string }>;
};

export type LoginResponse = ApiSuccess<{
  token: string;
  user?: User;
}>;

export type RegisterResponse = ApiSuccess<{
  token?: string;
  user?: User;
  message?: string;
}>;

export type ProfileResponse = ApiSuccess<{
  user: User;
}>;

export type UpdateProfileResponse = ApiSuccess<{
  user: User;
}>;

export type UpdatePasswordResponse = ApiSuccess<Record<string, never>>;
