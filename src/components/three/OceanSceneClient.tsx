"use client";

import dynamicImport from "next/dynamic";
import { CuteFishPreloader } from "@/components/ui/CuteFishPreloader";

const OceanScene = dynamicImport(() => import("./OceanScene"), {
  ssr: false,
  loading: () => <CuteFishPreloader />,
});

export default function OceanSceneClient() {
  return <OceanScene />;
}

