import { NextRequest, NextResponse } from "next/server";
import { odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/payments
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        // Proxy to custom backend endpoint
        const data = await odooFetch("/api/payments", "GET", undefined, cookie || undefined);
        return NextResponse.json({ status: "success", data: data });
    } catch (error: any) {
        console.error("Payments API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/odoo/payments
export async function POST(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const body = await request.json();

        // Proxy to custom backend endpoint
        const result = await odooFetch("/api/payments", "POST", body, cookie || undefined);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Create Payment Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
