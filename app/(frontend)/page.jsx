"use client";

import TestPackages from "@/components/frontend/TestPackages";
import HeroSection from "@/components/frontend/HeroSection";
import { useRouter } from "next/navigation";
import InstituteCarousel from "@/components/frontend/InstitutesAdvertisments";
import AchieversSection from "@/components/frontend/AchieversSection";

export default function Home() {
  const router = useRouter();

  return (
    <>
      {/* <HeroSection />
      <TestPackages />
      <InstituteCarousel />
      <AchieversSection /> */}
    </>
  );
}
