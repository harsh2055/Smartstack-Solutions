import { redirect } from "next/navigation";

// Redirect case-studies admin to projects (same data)
export default function AdminCaseStudiesPage() {
  redirect("/admin/projects");
}
