import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { signInWithGoogle } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const GoogleAuthPanel = () => {
  const { user, isLoading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Could not start Google sign in",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Checking your sign-in status...
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">Sign in to create a group</p>
          <p className="text-sm text-muted-foreground">
            You can view active groups without signing in.
          </p>
          {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Redirecting..." : "Continue with Google"}
        </Button>
      </div>
    </div>
  );
};

export default GoogleAuthPanel;
