import { getRooms } from "@/lib/db";
import RoomsAdminClient from "./RoomsAdminClient";

export const dynamic = "force-dynamic";

export default async function RoomsAdminPage() {
  const rooms = await getRooms();
  return <RoomsAdminClient initialData={rooms} />;
}
