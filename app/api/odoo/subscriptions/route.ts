
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/subscriptions
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get("partner_id");

        // Strategy: In modern Odoo (16+), Subscriptions are often Sale Orders with a recurring boolean
        // OR they are in the separate 'sale.subscription' model (Odoo 15 and older, or Enterprise)
        // We will attempt to query sale.order first as it's more standard in Community.
        // Adjust 'model' below if you have the explicit subscription module.

        // Let's assume standard Sale Orders for now, filtering by valid states
        const domain: any[] = [["state", "in", ["draft", "sent", "sale", "done"]]];

        if (partnerId) {
            domain.push(["partner_id", "=", parseInt(partnerId)]);
        }

        const fields = ["id", "name", "partner_id", "date_order", "amount_total", "state"];

        const subscriptions = await odooCall("call", {
            model: "sale.order",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100, order: "date_order desc" },
        }, cookie || undefined);

        return NextResponse.json({ status: "success", data: subscriptions });
    } catch (error: any) {
        console.error("Subscriptions API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
