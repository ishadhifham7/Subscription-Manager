import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../auth/auth.service";
import { createOrFetchUser } from "../api/user.api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register(email, password);
      await createOrFetchUser();
      navigate("/");
    } catch (err) {
      if (
        err instanceof FirebaseError &&
        err.code === "auth/email-already-in-use"
      ) {
        try {
          // If Firebase account exists already, sign in and ensure backend user exists.
          await authService.login(email, password);
          await createOrFetchUser();
          navigate("/");
          return;
        } catch (recoveryError) {
          setError(
            recoveryError instanceof Error
              ? recoveryError.message
              : "Email already exists. Please use Login to continue.",
          );
          return;
        }
      }

      setError(err instanceof Error ? err.message : "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Create account</h1>
        <p className="auth-subtitle">Start securing your subscription data.</p>

        <form onSubmit={handleSignup} className="auth-form">
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
              minLength={6}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <p className="auth-link-row">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
