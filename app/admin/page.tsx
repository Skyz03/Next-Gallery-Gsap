import { supabase } from "@/lib/supabase";
import AdminDashboard from "./AdminDashboard";

export type AdminProject = {
  id: string;
  title: string;
  client: string;
  category: string;
  cover_image: string;
  created_at: string;
};

export default async function AdminPage() {
  const { data } = await supabase
    .from("projects")
    .select("id, title, client, category, cover_image, created_at")
    .order("created_at", { ascending: false });

  return <AdminDashboard initialProjects={(data as AdminProject[]) ?? []} />;
}
