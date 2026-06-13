"use client";

import { useEffect, useState } from "react";
import dynamicImport from "next/dynamic";
import { CuteFishPreloader } from "@/components/ui/CuteFishPreloader";

const OceanScene = dynamicImport(() => import("./OceanScene"), {
  ssr: false,
  loading: () => <CuteFishPreloader />,
});

export default function OceanSceneClient() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // On mobile/tablet, completely skip loading the WebGL scene chunk
  if (isDesktop === false) {
    return null;
  }

  // Pre-render state before hook runs
  if (isDesktop === null) {
    return <CuteFishPreloader />;
  }

  return <OceanScene />;
}

