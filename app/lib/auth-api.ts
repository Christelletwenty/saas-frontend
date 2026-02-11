import { METHODS } from "http";
import {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
  RegisterPayload,
  RegisterResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "../types/auth";
import { apiFetch } from "./api";

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getProfile(): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>("/auth/profile", {
    method: "GET",
    auth: true,
  });
}

export function updateProfile(
  payload: UpdateProfilePayload,
): Promise<UpdateProfileResponse> {
  return apiFetch<UpdateProfileResponse>("/auth/profile", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function updatePassword(
  payload: UpdatePasswordPayload,
): Promise<UpdatePasswordResponse> {
  return apiFetch<UpdatePasswordResponse>("/auth/password", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}
