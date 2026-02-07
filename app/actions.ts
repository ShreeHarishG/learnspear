"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createAdminInvitation(email: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  try {
    const client = await clerkClient();

    const user = await client.users.getUser(userId);
    const role = user.publicMetadata.role || user.unsafeMetadata.role;

    if (role !== "admin") {
      throw new Error("Unauthorized: Only admins can invite users.");
    }

    await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl:
        process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ||
        "http://localhost:3000/sign-in",
      publicMetadata: {
        role: "admin",
      },
      ignoreExisting: true,
    });

    return { success: true, message: "Invitation sent successfully." };
  } catch (error: any) {
    console.error("Error creating invitation:", error);
    return {
      success: false,
      message: error?.message || "Failed to create invitation",
    };
  }
}

export async function getCurrentUserRole(): Promise<string | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const role =
      (user.publicMetadata?.role as string | undefined) ||
      (user.unsafeMetadata?.role as string | undefined);

    return role ?? null;
  } catch (error) {
    console.error("getCurrentUserRole error:", error);
    return null;
  }
}