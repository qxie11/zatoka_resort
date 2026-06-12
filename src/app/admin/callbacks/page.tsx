import { prisma } from "@/lib/prisma";
import CallbacksAdminClient from "./CallbacksAdminClient";

export const dynamic = "force-dynamic";

export default async function CallbacksAdminPage() {
  const requests = await prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Convert Date objects to ISO strings for Next.js serialization
  const serializedRequests = requests.map((req) => ({
    ...req,
    createdAt: req.createdAt.toISOString(),
    updatedAt: req.updatedAt.toISOString(),
  }));

  return <CallbacksAdminClient initialData={serializedRequests} />;
}
