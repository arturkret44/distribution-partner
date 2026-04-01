import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function requireApprovedUser() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("verification_status, role")
    .eq("id", user.id)
    .single();

if (profile?.verification_status === "pending") {
  redirect("/waiting");
}

if (profile?.verification_status === "incomplete") {
redirect(`/${profile.role}/profile`);
}

  return { user };
}

export async function requireRole(expectedRole: "farmer" | "buyer" | "admin" | "transport" | "warehouse") {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, verification_status")
    .eq("id", user.id)
    .single();


if (profile?.verification_status === "pending") {
  redirect("/waiting");
}

  if (profile?.role !== expectedRole) {
    redirect("/"); // na razie neutralnie
  }

  return { user, role: profile.role };
}
export async function requireLoggedUser() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { user };
}
export async function requireViewer() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("verification_status")
    .eq("id", user.id)
    .single();

  if (profile?.verification_status === "pending") {
    redirect("/waiting");
  }

  if (profile?.verification_status === "incomplete") {
    redirect("/complete-profile");
  }

  return { user };
}
