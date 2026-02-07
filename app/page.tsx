import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingNavbar } from "@/components/LandingNavbar";
import { LandingHero } from "@/components/LandingHero";
import { LandingFeatures } from "@/components/LandingFeatures";
import { LandingFooter } from "@/components/LandingFooter";

export default async function Home() {
  const user = await currentUser();

  // Redirect authenticated users to their dashboard
  if (user) {
    const role = (user.publicMetadata.role || user.unsafeMetadata.role) as string | undefined;

    if (role === "admin") {
      redirect("/admin");
    } else if (role === "user") {
      redirect("/user");
    } else {
      // Fallback if role is missing
      redirect("/user");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}
