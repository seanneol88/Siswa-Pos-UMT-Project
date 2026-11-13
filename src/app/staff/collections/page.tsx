import { CollectionWorkspace } from "@/components/collection-workspace";
import { StaffAppShell } from "@/components/staff-app-shell";
import { StaffLogin } from "@/components/staff-login";
import { getSessionUser } from "@/lib/auth";

export default async function CollectionPage() {
  const user = await getSessionUser();
  if (!user) return <StaffLogin />;

  return <StaffAppShell user={user}><CollectionWorkspace /></StaffAppShell>;
}
