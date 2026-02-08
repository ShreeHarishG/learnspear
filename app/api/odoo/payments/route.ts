import { NextRequest, NextResponse } from "next/server";
import { odooCall, odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/payments
// GET /api/odoo/payments
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");

        const domain: any[] = [];
        const fields = ["id", "name", "date", "amount", "state", "payment_type", "partner_id"];

        const payments = await odooCall("call", {
            model: "account.payment",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100, order: "date desc" },
        }, cookie || undefined);

        return NextResponse.json({ status: "success", data: payments });
    } catch (error: any) {
        console.error("Payments API Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
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
