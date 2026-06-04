import { supabase } from "./supabase";
import { getCurrentUser } from "./auth";

export type Ticket = {
  id: string;
  group_id: string;
  user_id: string;
  origin: string;
  destination: string;
  created_at: string;
};

export async function fetchUserTicketForGroup(groupId: string): Promise<Ticket | null> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from("tickets")
    .select("id, group_id, user_id, origin, destination, created_at")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[tickets] Error fetching ticket:", error.message);
    throw new Error(error.message);
  }

  return data as Ticket | null;
}
