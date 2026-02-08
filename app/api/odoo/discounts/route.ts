
import { NextRequest, NextResponse } from "next/server";
import { odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/discounts
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        // Proxy to custom backend endpoint
        const data = await odooFetch("/api/discounts", "GET", undefined, cookie || undefined);
        return NextResponse.json({ status: "success", data: data });
    } catch (error: any) {
        console.error("Discounts API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
