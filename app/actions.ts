"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createAdminInvitation(email: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Not authenticated");
    }

    try {
        const client = await clerkClient();

        // precise permissions check would be better, but assuming any admin can invite
        const user = await client.users.getUser(userId);
        const role = user.publicMetadata.role || user.unsafeMetadata.role;

        if (role !== "admin") {
            throw new Error("Unauthorized: Only admins can invite other admins.");
        }

        await client.invitations.createInvitation({
            emailAddress: email,
            redirectUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "http://localhost:4000",
            publicMetadata: {
                role: "admin",
            },
            ignoreExisting: true,
        });

        return { success: true, message: "Invitation sent successfully." };
    } catch (error: any) {
        console.error("Error creating invitation:", error);
        return { success: false, message: error.message || "Failed to create invitation" };
    }
}
