import { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { signIn } from "../auth/authService";

export default function LoginPage() {
  const context = useContext(AuthContext);

  if (!context) {
    return null;
  }

  const { auth } = context;

  const onLogin = async () => {
    if (auth.loading || auth.isProcessingRedirect || auth.isAuthenticated) {
      return;
    }

    await signIn();
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Subscription Manager</h1>
        <p className="auth-subtitle">Sign in to continue.</p>

        <button
          type="button"
          className="google-btn"
          onClick={onLogin}
          disabled={
            auth.loading || auth.isProcessingRedirect || auth.isAuthenticated
          }
        >
          {auth.loading || auth.isProcessingRedirect ? "Loading..." : "Sign In"}
        </button>
      </section>
    </main>
  );
}
