import { supabase } from "./supabase";
import { getCurrentUser, syncUserProfile } from "./auth";

type GroupMember = {
  id: string;
  user_id: string;
  status: string;
  seats_reserved: number | null;
};

export type TravelGroup = {
  id: string;
  origin: string;
  destination: string;
  current_members: number;
  max_members: number;
  status: string;
  expiry_date: string;
  group_members: GroupMember[];
  joinedMemberCount: number;
  joinedSeats: number;
  availableSeats: number;
  currentUserMembership: GroupMember | null;
};

type CreateTravelGroupInput = {
  origin: string;
  destination: string;
  seatsReserved: number;
};

const MAX_GROUP_MEMBERS = 4;
const GROUP_EXPIRY_MINUTES = 30;
const ACTIVE_MEMBER_STATUSES = new Set(["active"]);

type TravelGroupRow = {
  id: string;
  origin: string;
  destination: string;
  current_members: number | null;
  max_members: number | null;
  status: string;
  expiry_date: string;
  group_members: GroupMember[] | null;
};

const isActiveMember = (member: GroupMember) =>
  ACTIVE_MEMBER_STATUSES.has(member.status);

const normalizeTravelGroup = (
  group: TravelGroupRow,
  userId?: string | null
): TravelGroup => {
  const members = group.group_members ?? [];
  const activeMembers = members.filter(isActiveMember);
  const joinedSeats = activeMembers.reduce(
    (sum, member) => sum + (member.seats_reserved ?? 0),
    0
  );
  const maxMembers = group.max_members ?? MAX_GROUP_MEMBERS;

  return {
    id: group.id,
    origin: group.origin,
    destination: group.destination,
    current_members: joinedSeats || group.current_members || 0,
    max_members: maxMembers,
    status: group.status,
    expiry_date: group.expiry_date,
    group_members: members,
    joinedMemberCount: activeMembers.length,
    joinedSeats,
    availableSeats: Math.max(maxMembers - joinedSeats, 0),
    currentUserMembership:
      activeMembers.find((member) => member.user_id === userId) ?? null,
  };
};

export async function fetchTravelGroups(
  currentUserId?: string | null
): Promise<TravelGroup[]> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("travel_groups")
    .select(
      `
        id,
        origin,
        destination,
        current_members,
        max_members,
        status,
        expiry_date,
        group_members (
          id,
          user_id,
          status,
          seats_reserved
        )
      `
    )
    .eq("status", "open")
    .gt("expiry_date", now)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as TravelGroupRow[]).map((group) =>
    normalizeTravelGroup(group, currentUserId)
  );
}

export async function joinTravelGroup(groupId: string): Promise<TravelGroup> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const user = await getCurrentUser();
  await syncUserProfile(user);

  const { data: selectedGroup, error: groupError } = await supabase
    .from("travel_groups")
    .select(
      `
        id,
        origin,
        destination,
        current_members,
        max_members,
        status,
        expiry_date,
        group_members (
          id,
          user_id,
          status,
          seats_reserved
        )
      `
    )
    .eq("id", groupId)
    .maybeSingle();

  if (groupError) {
    throw new Error(groupError.message);
  }

  if (!selectedGroup) {
    throw new Error("Group does not exist.");
  }

  const normalizedGroup = normalizeTravelGroup(
    selectedGroup as TravelGroupRow,
    user.id
  );

  if (normalizedGroup.status !== "open") {
    throw new Error("Group is no longer open.");
  }

  if (normalizedGroup.currentUserMembership) {
    throw new Error("Already joined this group");
  }

  if (normalizedGroup.availableSeats < 1) {
    throw new Error("Group is already full");
  }

  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: selectedGroup.id,
    user_id: user.id,
    seats_reserved: 1,
    status: "active",
    joined_at: new Date().toISOString(),
  });

  if (memberError) {
    if (memberError.code === "23505") {
      throw new Error("Already joined this group");
    }

    throw new Error(memberError.message);
  }

  return {
    ...normalizedGroup,
    group_members: [
      ...normalizedGroup.group_members,
      {
        id: "optimistic-current-user-membership",
        user_id: user.id,
        seats_reserved: 1,
        status: "active",
      },
    ],
    current_members: normalizedGroup.joinedSeats + 1,
    joinedMemberCount: normalizedGroup.joinedMemberCount + 1,
    joinedSeats: normalizedGroup.joinedSeats + 1,
    availableSeats: Math.max(normalizedGroup.availableSeats - 1, 0),
    currentUserMembership: {
      id: "optimistic-current-user-membership",
      user_id: user.id,
      seats_reserved: 1,
      status: "active",
    },
  };
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
    .select(
      "id, origin, destination, current_members, max_members, status, expiry_date"
    )
    .single();

  if (groupError) {
    throw new Error(groupError.message);
  }

  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user.id,
    seats_reserved: seatsReserved,
    status: "active",
    joined_at: now.toISOString(),
  });

  if (memberError) {
    throw new Error(memberError.message);
  }

  return normalizeTravelGroup(
    {
      ...(group as Omit<TravelGroupRow, "group_members">),
      group_members: [
        {
          id: "current-user-membership",
          user_id: user.id,
          seats_reserved: seatsReserved,
          status: "active",
        },
      ],
    },
    user.id
  );
}

export async function leaveTravelGroup(groupId: string): Promise<TravelGroup> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const user = await getCurrentUser();

  const { data: selectedGroup, error: groupError } = await supabase
    .from("travel_groups")
    .select(
      `
        id,
        origin,
        destination,
        current_members,
        max_members,
        status,
        expiry_date,
        group_members (
          id,
          user_id,
          status,
          seats_reserved
        )
      `
    )
    .eq("id", groupId)
    .maybeSingle();

  if (groupError) {
    throw new Error(groupError.message);
  }

  if (!selectedGroup) {
    throw new Error("Group does not exist.");
  }

  const normalizedGroup = normalizeTravelGroup(
    selectedGroup as TravelGroupRow,
    user.id
  );

  if (!normalizedGroup.currentUserMembership) {
    throw new Error("Not a member of this group");
  }

  const { error: deleteError } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const updatedMembers = normalizedGroup.group_members.filter(
    (member) => member.user_id !== user.id
  );

  const activeMembers = updatedMembers.filter(isActiveMember);
  const joinedSeats = activeMembers.reduce(
    (sum, member) => sum + (member.seats_reserved ?? 0),
    0
  );

  return {
    ...normalizedGroup,
    group_members: updatedMembers,
    current_members: joinedSeats,
    joinedMemberCount: activeMembers.length,
    joinedSeats,
    availableSeats: Math.max(normalizedGroup.max_members - joinedSeats, 0),
    currentUserMembership: null,
  };
}
