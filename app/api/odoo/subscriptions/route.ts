import { NextRequest, NextResponse } from "next/server";
import { odooCall, odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/subscriptions
// GET /api/odoo/subscriptions
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get("partner_id");

        // "Subscriptions" in this simple context are Sale Orders
        const domain: any[] = [["state", "in", ["sale", "done"]]];

        if (partnerId) {
            domain.push(["partner_id", "=", parseInt(partnerId)]);
        }

        const fields = ["id", "name", "date_order", "amount_total", "state", "partner_id"];

        const subscriptions = await odooCall("call", {
            model: "sale.order",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100, order: "date_order desc" },
        }, cookie || undefined);

        // Map to expected interface
        const mapped = Array.isArray(subscriptions) ? subscriptions.map((s: any) => ({
            ...s,
            start_date: s.date_order, // Map date_order to start_date
            plan_id: [0, "Basic"],    // Placeholder/Mock as 'sale.order' lacks plan_id
        })) : [];

        return NextResponse.json({ status: "success", data: mapped });
    } catch (error: any) {
        console.error("Subscriptions API Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}

// DELETE /api/odoo/subscriptions
export async function DELETE(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const result = await odooFetch(`/api/subscriptions/${id}`, "DELETE", undefined, cookie || undefined);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Delete Subscription Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}