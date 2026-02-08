import { NextRequest, NextResponse } from "next/server";
import { odooCall, odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/users
// GET /api/odoo/users
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");

        // Fetch users using RPC
        // Filter out system users? Maybe just share=False for internal? 
        // For now, get all active users.
        const domain = [["active", "=", true]];
        const fields = ["id", "name", "login", "email", "image_128"];

        const users = await odooCall("call", {
            model: "res.users",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100 },
        }, cookie || undefined);

        // Map 'login' to 'email' as frontend expects 'email'
        const mapped = Array.isArray(users) ? users.map((u: any) => ({
            ...u,
            email: u.login || u.email
        })) : [];

        return NextResponse.json({ status: "success", data: mapped });
    } catch (error: any) {
        console.error("Users API Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}
