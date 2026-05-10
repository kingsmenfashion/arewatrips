import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type AuthUser = User;

export type UserProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  auth_provider: string | null;
  created_at: string;
  last_login: string;
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
};

export async function signInWithGoogle() {
  const client = requireSupabase();

  console.info("[auth] Starting Google sign in.");
  const { error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function signOut() {
  const client = requireSupabase();
  console.info("[auth] Signing out current user.");
  const { error } = await client.auth.signOut();

  if (error) {
    console.error("[auth] Sign out failed:", error.message);
    throw new Error(error.message);
  }

  console.info("[auth] User signed out.");
}

export async function getCurrentSession(): Promise<Session | null> {
  const client = requireSupabase();
  const { data, error } = await client.auth.getSession();

  if (error) {
    console.error("[auth] Could not read current session:", error.message);
    throw new Error(error.message);
  }

  return data.session;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const client = requireSupabase();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    console.error("[auth] Could not load current user:", error.message);
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("Please sign in before creating a travel group.");
  }

  return user;
}

export async function syncUserProfile(user: AuthUser): Promise<void> {
  const client = requireSupabase();
  const fullName =
    user.user_metadata?.full_name || user.user_metadata?.name || null;
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  const authProvider =
    user.app_metadata?.provider ||
    user.identities?.[0]?.provider ||
    "google";
  const lastLogin = new Date().toISOString();

  console.info("[auth] Syncing Supabase profile:", {
    userId: user.id,
    email: user.email,
    provider: authProvider,
  });

  const { data: existingProfile, error: lookupError } = await client
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (lookupError) {
    console.error("[auth] Profile lookup failed:", lookupError.message);
    throw new Error(lookupError.message);
  }

  const updateProfile = async () => {
    const { error: updateError } = await client
      .from("profiles")
      .update({
        full_name: fullName,
        email: user.email ?? null,
        avatar_url: avatarUrl,
        auth_provider: authProvider,
        last_login: lastLogin,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("[auth] Profile update failed:", updateError.message);
      throw new Error(updateError.message);
    }
  };

  if (existingProfile) {
    await updateProfile();

    console.info("[auth] Existing Supabase profile updated:", user.id);
    return;
  }

  const { error: insertError } = await client.from("profiles").insert({
    id: user.id,
    full_name: fullName,
    email: user.email ?? null,
    avatar_url: avatarUrl,
    auth_provider: authProvider,
    created_at: user.created_at ?? lastLogin,
    last_login: lastLogin,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      console.warn("[auth] Profile already exists, updating instead:", user.id);
      await updateProfile();
      return;
    }

    console.error("[auth] Profile insert failed:", {
  message: insertError.message,
  code: insertError.code,
  details: insertError.details,
  hint: insertError.hint,
});
    throw new Error(insertError.message);
  }

  console.info("[auth] New Supabase profile created:", user.id);
}

export function onAuthSessionChange(
  onChange: (session: Session | null, event: AuthChangeEvent) => void
) {
  const client = requireSupabase();

  return client.auth.onAuthStateChange((event, session) => {
    onChange(session, event);
  });
}
