
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/discounts
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");

        // Fetch Pricelists (product.pricelist)
        const domain: any[] = [];
        const fields = ["id", "name", "active", "currency_id"];

        const pricelists = await odooCall("call", {
            model: "product.pricelist",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100 },
        }, cookie || undefined);

        const formatted = pricelists.map((p: any) => ({
            id: p.id,
            name: p.name,
            type: "Pricelist",
            value: p.currency_id?.[1] || "N/A",
            status: p.active ? "Active" : "Inactive"
        }));

        return NextResponse.json({ status: "success", data: formatted });
    } catch (error: any) {
        console.error("Discounts API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
