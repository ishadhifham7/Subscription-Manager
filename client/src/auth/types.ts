export interface AuthUser {
  username?: string;
  email?: string;
  sub?: string;
}

export interface AuthState {
  loading: boolean;
  isProcessingRedirect: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
}
