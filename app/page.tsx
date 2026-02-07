import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingNavbar } from "@/components/LandingNavbar";
import { LandingHero } from "@/components/LandingHero";
import { LandingFeatures } from "@/components/LandingFeatures";
import { LandingTestimonials } from "@/components/LandingTestimonials";
import { LandingFAQ } from "@/components/LandingFAQ";
import { LandingCTA } from "@/components/LandingCTA";
import { LandingFooter } from "@/components/LandingFooter";

// Helper function to sync user with Odoo
async function syncUserWithOdoo(email: string) {
  try {
    const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || "http://localhost:8069";
    const SECRET = process.env.ODOO_SECRET_KEY || "your_shared_secret"; // Must match what you put in api.py

    const res = await fetch(`${ODOO_URL}/api/auth/clerk_sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, secret_key: SECRET }),
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Odoo Sync Error:", error);
    return null;
  }
}

export default async function Home() {
  const user = await currentUser();

  // Redirect authenticated users to their dashboard
  if (user) {
    const email = user.emailAddresses[0]?.emailAddress;
    
    // 1. Sync with Odoo if we have an email
    if (email) {
      await syncUserWithOdoo(email);
    }

    // 2. Determine Role and Redirect
    const role = (user.publicMetadata.role || user.unsafeMetadata.role) as string | undefined;

    if (role === "admin") {
      redirect("/admin");
    } else {
      // Default fallback for 'user' or missing role
      redirect("/user");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingTestimonials />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}