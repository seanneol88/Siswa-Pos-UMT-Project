import { ParcelWorkspace } from "@/components/parcel-workspace";
import { StaffAppShell } from "@/components/staff-app-shell";
import { StaffLogin } from "@/components/staff-login";
import { getSessionUser } from "@/lib/auth";
import { getStaffParcels } from "@/lib/staff-data";

export default async function ParcelManagementPage() {
  const user = await getSessionUser();
  if (!user) return <StaffLogin />;

  const parcels = await getStaffParcels();
  return <StaffAppShell user={user}><ParcelWorkspace initialParcels={parcels} /></StaffAppShell>;
}
