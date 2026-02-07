
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/payments
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get("partner_id");

        const domain: any[] = [];
        if (partnerId) {
            domain.push(["partner_id", "=", parseInt(partnerId)]);
        }

        const fields = ["id", "name", "date", "amount", "partner_id", "state"];

        const payments = await odooCall("call", {
            model: "account.payment",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100, order: "date desc" },
        }, cookie || undefined);

        return NextResponse.json({ status: "success", data: payments });
    } catch (error: any) {
        console.error("Payments API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
