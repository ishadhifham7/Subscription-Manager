import { apiClient } from "./client";
import type { UserProfile } from "../types/user.types";

export function getUserProfile() {
  return apiClient<UserProfile>("/api/user/me", {
    method: "GET",
  });
}

export function createOrFetchUser() {
  return apiClient<UserProfile>("/api/user", {
    method: "POST",
  });
}
