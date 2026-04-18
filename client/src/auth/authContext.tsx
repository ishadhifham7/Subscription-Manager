import { createContext, useEffect, useState } from "react";
import type { AuthState } from "./types";
import { isAuthenticated, getUserInfo, getAccessToken } from "./authService";
import { handleSignInRedirect, initializeAuthClient } from "./authClient";

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    loading: true,
    isProcessingRedirect: false,
    isAuthenticated: false,
    user: null,
    accessToken: null,
  });

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await initializeAuthClient();

        const hasRedirectParams = (() => {
          const params = new URLSearchParams(window.location.search);
          return (
            params.has("code") ||
            params.has("session_state") ||
            params.has("state")
          );
        })();

        if (hasRedirectParams && isMounted) {
          console.debug("Redirect detected");
          setAuth((previous) => ({ ...previous, isProcessingRedirect: true }));
          console.debug("Handling redirect...");
          await handleSignInRedirect();
          console.debug("Redirect handled");
        }

        if (isMounted) {
          setAuth((previous) => ({ ...previous, isProcessingRedirect: false }));
        }

        console.debug("Checking authentication...");

        const loggedIn = await isAuthenticated();
        console.debug(`Authenticated: ${loggedIn}`);

        if (!loggedIn) {
          if (!isMounted) {
            return;
          }

          setAuth({
            loading: false,
            isProcessingRedirect: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
          });
          return;
        }

        const [user, token] = await Promise.all([
          getUserInfo(),
          getAccessToken(),
        ]);

        if (!isMounted) {
          return;
        }

        setAuth({
          loading: false,
          isProcessingRedirect: false,
          isAuthenticated: true,
          user,
          accessToken: token,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setAuth({
          loading: false,
          isProcessingRedirect: false,
          isAuthenticated: false,
          user: null,
          accessToken: null,
        });
      }
    };

    void init();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
