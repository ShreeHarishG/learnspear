"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import odooAPI from "@/lib/odoo-api"; // Import if you want to pre-create customers in Odoo

export async function createAdminInvitation(email: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Security: Only trust publicMetadata for admin checks
    const role = user.publicMetadata.role;

    if (role !== "admin") {
      throw new Error("Unauthorized: Only admins can invite users.");
    }

    // Create the invitation
    await client.invitations.createInvitation({
      emailAddress: email,
      // Ensure this points to your sign-up page so the Odoo sync triggers on completion
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sign-up`,
      publicMetadata: {
        role: "admin", // New user will inherit this role securely
      },
      ignoreExisting: true,
    });

    return { success: true, message: "Invitation sent successfully." };
  } catch (error: any) {
    console.error("Error creating invitation:", error);
    return {
      success: false,
      message: error?.errors?.[0]?.message || error?.message || "Failed to create invitation",
    };
  }
}

export async function getCurrentUserRole(): Promise<string | null> {
  const { userId } = await auth();

  if (!userId) return null;

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Priority: publicMetadata (Admin set) > unsafeMetadata (Self set)
    const role = (user.publicMetadata?.role as string) || (user.unsafeMetadata?.role as string);

    return role ?? "user";
  } catch (error) {
    console.error("getCurrentUserRole error:", error);
    return null;
  }
}