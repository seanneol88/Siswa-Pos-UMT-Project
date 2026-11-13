import { DashboardOverview } from "@/components/dashboard-overview";
import { StaffAppShell } from "@/components/staff-app-shell";
import { StaffLogin } from "@/components/staff-login";
import { getSessionUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/staff-data";

export default async function StaffPage() {
  const user = await getSessionUser();
  if (!user) return <StaffLogin />;

  const data = await getDashboardData();
  return <StaffAppShell user={user}><DashboardOverview {...data} userName={user.displayName} /></StaffAppShell>;
}
