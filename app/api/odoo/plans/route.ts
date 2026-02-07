
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/plans
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");

        // Fetch Subscription Plans
        // Try 'sale.subscription.plan' (Enterprise) first, fallback to products
        let plans = [];
        try {
            plans = await odooCall("call", {
                model: "sale.subscription.plan",
                method: "search_read",
                args: [[], ["id", "name", "billing_period_value", "billing_period_unit"]],
                kwargs: { limit: 100 },
            }, cookie || undefined);
        } catch (e) {
            // Fallback: Fetch Service Products
            plans = await odooCall("call", {
                model: "product.template",
                method: "search_read",
                args: [[["detailed_type", "=", "service"]], ["id", "name", "list_price"]],
                kwargs: { limit: 100 },
            }, cookie || undefined);
        }

        const formatted = plans.map((p: any) => ({
            id: p.id,
            name: p.name,
            // Map fields based on what model we actually got
            billing_period: p.billing_period_unit || "Month",
            price: p.list_price || 0
        }));

        return NextResponse.json({ status: "success", data: formatted });
    } catch (error: any) {
        console.error("Plans API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
