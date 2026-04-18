import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";

function OAuth2SuccessPage() {
  const { completeGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const finalizeLogin = async () => {
      try {
        await completeGoogleLogin();
        navigate("/dashboard", { replace: true });
      } catch (err) {
        setError("Google login completed, but user session could not be loaded.");
      }
    };

    finalizeLogin();
  }, []);

  return (
    <PageShell
      title="Signing you in"
      subtitle="Completing your Google login session."
    >
      <Card>
        {error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <p className="text-sm text-slate-400">Please wait...</p>
        )}
      </Card>
    </PageShell>
  );
}

export default OAuth2SuccessPage;