import { NextRequest, NextResponse } from "next/server";
import { odooCall, odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/users
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        // Proxy to custom backend endpoint
        const data = await odooFetch("/api/users", "GET", undefined, cookie || undefined);

        // Map 'login' to 'email' as frontend expects 'email'
        const mapped = Array.isArray(data) ? data.map((u: any) => ({
            ...u,
            email: u.login || u.email
        })) : data;

        return NextResponse.json({ status: "success", data: mapped });
    } catch (error: any) {
        console.error("Users API Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}
