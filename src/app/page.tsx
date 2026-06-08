import { getRooms } from "@/lib/db";
import HomeClient from "@/components/home/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rooms = await getRooms();

  return <HomeClient rooms={rooms} />;
}
