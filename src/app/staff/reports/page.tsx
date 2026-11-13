import { ReportWorkspace } from "@/components/report-workspace";
import { StaffAppShell } from "@/components/staff-app-shell";
import { StaffLogin } from "@/components/staff-login";
import { getSessionUser } from "@/lib/auth";
import { getReportData } from "@/lib/staff-data";

export default async function ReportsPage() {
  const user = await getSessionUser();
  if (!user) return <StaffLogin />;

  const report = await getReportData();
  return <StaffAppShell user={user}><ReportWorkspace {...report} /></StaffAppShell>;
}
