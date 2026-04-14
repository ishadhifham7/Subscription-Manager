import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../auth/auth.service";
import { createOrFetchUser } from "../api/user.api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(email, password);
      await createOrFetchUser();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await authService.loginWithGoogle();
      await createOrFetchUser();
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to login with Google",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Subscription Manager</h1>
        <p className="auth-subtitle">Sign in to manage your subscriptions.</p>

        <form onSubmit={handleLogin} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </button>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-link-row">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </section>
    </main>
  );
}
