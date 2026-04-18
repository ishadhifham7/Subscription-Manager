import { useEffect, useState } from "react";
import { createOrFetchUser, getUserProfile } from "../api/user.api";
import type { UserProfile } from "../types/user.types";

export default function UserPage() {
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

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Welcome</h1>

        {loading && <p className="auth-subtitle">Loading your profile...</p>}

        {!loading && !error && (
          <>
            <p className="auth-subtitle">Profile loaded from backend.</p>
            <dl className="profile-list">
              <dt>Email</dt>
              <dd>{profile?.email ?? "Unknown"}</dd>
              <dt>UID</dt>
              <dd>{profile?.uid ?? "Unknown"}</dd>
            </dl>
          </>
        )}

        {error && <p className="auth-error">{error}</p>}
      </section>
    </main>
  );
}
