import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";
import type { AuthUser } from "@/lib/auth";

export type AuthContextValue = {
  session: Session | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
