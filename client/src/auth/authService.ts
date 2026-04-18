import { authClient } from "./authClient";
import { isRedirectProcessing } from "./authClient";
import type { AuthUser } from "./types";

// 🔐 Login
export const signIn = async (
  authorizationCode?: string,
  sessionState?: string,
  state?: string,
): Promise<void> => {
  if (isRedirectProcessing()) {
    return;
  }

  const authenticated = await authClient.isAuthenticated();

  if (authenticated) {
    return;
  }

  await authClient.signIn(undefined, authorizationCode, sessionState, state);
};

// 🔐 Logout
export const signOut = async (): Promise<void> => {
  await authClient.signOut();
};

// 🔑 Get ACCESS TOKEN (JWT)
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await authClient.getAccessToken();
    return token ?? null;
  } catch {
    return null;
  }
};

// 👤 Get user info
export const getUserInfo = async (): Promise<AuthUser | null> => {
  const info = await authClient.getBasicUserInfo();

  if (!info) {
    return null;
  }

  return {
    username: info.username,
    email: info.email,
    sub: info.sub,
  };
};

// 🔍 Auth check
export const isAuthenticated = async (): Promise<boolean> => {
  const authenticated = await authClient.isAuthenticated();
  return Boolean(authenticated);
};

// Backward-compatible service shape for existing imports/usages.
export const authService = {
  signIn,
  signOut,
  getAccessToken,
  getUserInfo,
  isAuthenticated,
  login: async (_email?: string, _password?: string): Promise<void> => {
    await signIn();
  },
  register: async (_email?: string, _password?: string): Promise<void> => {
    await signIn();
  },
  loginWithGoogle: async (): Promise<void> => {
    await signIn();
  },
  logout: async (): Promise<void> => {
    await signOut();
  },
  getIdToken: async (): Promise<string | null> => {
    return getAccessToken();
  },
};
