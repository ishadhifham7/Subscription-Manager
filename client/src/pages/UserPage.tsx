import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../auth/auth.service";
import { useAuth } from "../auth/useAuth";
import { createOrFetchUser, getUserProfile } from "../api/user.api";
import type { UserProfile } from "../types/user.types";

export default function UserPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        await createOrFetchUser();
        const response = await getUserProfile();
        setProfile(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Welcome</h1>

        {loading && <p className="auth-subtitle">Loading your profile...</p>}

        {!loading && !error && (
          <>
            <p className="auth-subtitle">
              Firebase Auth user is active and backend token verification
              succeeded.
            </p>
            <dl className="profile-list">
              <dt>Email</dt>
              <dd>{profile?.email ?? user?.email ?? "Unknown"}</dd>
              <dt>UID</dt>
              <dd>{profile?.uid ?? user?.uid ?? "Unknown"}</dd>
            </dl>
          </>
        )}

        {error && <p className="auth-error">{error}</p>}

        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </section>
    </main>
  );
}
