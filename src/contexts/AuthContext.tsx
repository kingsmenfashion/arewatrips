import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase"; // Added this import
import {
  syncUserProfile,
  type AuthUser,
} from "@/lib/auth";
import { AuthContext, type AuthContextValue } from "./auth-context";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const syncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // 1. Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (!mounted) return;

        if (initialSession) {
          setSession(initialSession);
          // Sync profile silently in the background
          syncUserProfile(initialSession.user).catch((err) => 
            console.error("[auth] Background sync failed:", err)
          );
        }
      } catch (err) {
        console.error("[auth] Initialization error:", err);
        if (mounted) setError(err instanceof Error ? err.message : "Auth initialization failed");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for changes (this catches the redirect result)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.info(`[auth] Auth state changed: ${event}`);
      
      if (!mounted) return;

      setSession(currentSession);
      setIsLoading(false);

      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && currentSession?.user) {
        // Prevent double-syncing if already handled
        if (syncedUserIdRef.current !== currentSession.user.id) {
          syncedUserIdRef.current = currentSession.user.id;
          await syncUserProfile(currentSession.user).catch(console.error);
        }
      }
      
      if (event === 'SIGNED_OUT') {
        syncedUserIdRef.current = null;
        setError(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      error,
    }),
    [error, isLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};