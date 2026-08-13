import { getCurrentUser } from "@/server/auth";
import { canManageWorkspaceMembers } from "@/server/access";
import MarketingNav from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { Features } from "@/components/home/Features"
import { Hero } from "@/components/home/Hero";
import { AboutStats } from "@/components/home/About";
import { ProcessSteps } from "@/components/home/Process";
import { Challenges } from "@/components/home/Challanges";
import { FinalCTA } from "@/components/home/CTA";
import { Showcase } from "@/components/home/Showcase";
import { PlatformSection } from "@/components/home/platform";


export default async function MarketingPage() {
  const user = await getCurrentUser();

  const canManageMembers = user
    ? await canManageWorkspaceMembers(user.id)
    : false;

  return (
    <div className="min-h-screen overflow-hidden bg-[#F7F4EE] text-[#17161A]">
      <MarketingNav user={user} canManageMembers={canManageMembers} />

      <main>
        <Hero user={!!user} />
        <Features eyebrow="Core Features" />
        <AboutStats />
        <ProcessSteps />
        <Challenges />
        <Showcase />
        <PlatformSection />
        <FinalCTA user={!!user} />
      </main>

      <Footer user={!!user} />
    </div>
  );
}
