import { StaffWorkspace } from "@/components/staff-workspace";
import { getSessionUser } from "@/lib/auth";
import { getRecentStaffParcels } from "@/lib/staff-parcels";

export default async function StaffPage() {
  const user = await getSessionUser();
  const parcels = user ? await getRecentStaffParcels() : [];
  return <StaffWorkspace initialUser={user} initialParcels={parcels} />;
}
