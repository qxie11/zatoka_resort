import { prisma } from "@/lib/prisma";
import PromoAdminClient from "./PromoAdminClient";

export const dynamic = "force-dynamic";

export default async function PromoAdminPage() {
  const promos = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedPromos = promos.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return <PromoAdminClient initialData={serializedPromos} />;
}
