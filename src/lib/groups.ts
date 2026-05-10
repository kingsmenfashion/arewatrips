import { supabase } from "./supabase";
import { getCurrentUser, syncUserProfile } from "./auth";

export type TravelGroup = {
  id: string;
  origin: string;
  destination: string;
  current_members: number;
  max_members: number;
  expiry_date: string;
};

type CreateTravelGroupInput = {
  origin: string;
  destination: string;
  seatsReserved: number;
};

const MAX_GROUP_MEMBERS = 4;
const GROUP_EXPIRY_MINUTES = 30;

export async function fetchTravelGroups(): Promise<TravelGroup[]> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("travel_groups")
    .select("id, origin, destination, current_members, max_members, expiry_date")
    .eq("status", "open")
    .gt("expiry_date", now)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createTravelGroup({
  origin,
  destination,
  seatsReserved,
}: CreateTravelGroupInput): Promise<TravelGroup> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  if (seatsReserved < 1 || seatsReserved > MAX_GROUP_MEMBERS) {
    throw new Error("Reserved seats must be between 1 and 4.");
  }

  const now = new Date();
  const expiryDate = new Date(
    now.getTime() + GROUP_EXPIRY_MINUTES * 60 * 1000
  ).toISOString();
  const user = await getCurrentUser();
  await syncUserProfile(user);

  const { data: existingGroup, error: existingGroupError } = await supabase
    .from("travel_groups")
    .select("id")
    .eq("origin", origin)
    .eq("destination", destination)
    .eq("status", "open")
    .gt("expiry_date", now.toISOString())
    .limit(1)
    .maybeSingle();

  if (existingGroupError) {
    throw new Error(existingGroupError.message);
  }

  if (existingGroup) {
    throw new Error("An open group already exists for this route.");
  }

  const { data: group, error: groupError } = await supabase
    .from("travel_groups")
    .insert({
      origin,
      destination,
      current_members: seatsReserved,
      max_members: MAX_GROUP_MEMBERS,
      status: "open",
      created_by: user.id,
      expiry_date: expiryDate,
    })
    .select("id, origin, destination, current_members, max_members, expiry_date")
    .single();

  if (groupError) {
    throw new Error(groupError.message);
  }

  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user.id,
    seats_reserved: seatsReserved,
    status: "active",
  });

  if (memberError) {
    throw new Error(memberError.message);
  }

  return group;
}
