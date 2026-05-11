import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const finishAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("[auth] OAuth session read failed:", sessionError.message);
      }

      if (!session && code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("[auth] OAuth callback exchange failed:", error.message);
        }
      }

      if (mounted) {
        navigate("/student-groups", { replace: true });
      }
    };

    finishAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Finishing sign in...</p>
    </div>
  );
};

export default AuthCallback;
