import { AsgardeoSPAClient } from "@asgardeo/auth-spa";

const client = AsgardeoSPAClient.getInstance();
let redirectProcessing = false;

if (!client) {
  throw new Error("Failed to create Asgardeo client instance");
}

export const authClient: AsgardeoSPAClient = client;

export const initializeAuthClient = () =>
  authClient.initialize({
    signInRedirectURL: "http://localhost:5173",
    signOutRedirectURL: "http://localhost:5173",
    clientID: "Sje5RJpZccYVTuSbf1t3LPV8dJQa",
    baseUrl: "https://api.eu.asgardeo.io/t/ishadh",
    scope: ["openid", "profile"],
  });

export const isRedirectProcessing = (): boolean => redirectProcessing;

export const handleSignInRedirect = async (): Promise<boolean> => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const sessionState = params.get("session_state");
  const state = params.get("state");

  if (!code && !sessionState && !state) {
    return false;
  }

  if (redirectProcessing) {
    return true;
  }

  redirectProcessing = true;

  try {
    const sdkClient = authClient as AsgardeoSPAClient & {
      handleSignInRedirect?: () => Promise<void>;
    };

    if (typeof sdkClient.handleSignInRedirect === "function") {
      await sdkClient.handleSignInRedirect();
    } else {
      await authClient.signIn(
        undefined,
        code ?? undefined,
        sessionState ?? undefined,
        state ?? undefined,
      );
    }

    window.history.replaceState({}, document.title, "/");

    return true;
  } finally {
    redirectProcessing = false;
  }
};
