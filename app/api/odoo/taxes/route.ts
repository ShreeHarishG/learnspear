
import { NextRequest, NextResponse } from "next/server";
import { odooCall, odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/taxes
// GET /api/odoo/taxes
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");

        // Fetch Taxes
        const domain: any[] = [["type_tax_use", "=", "sale"]]; // Sales taxes only?
        const fields = ["id", "name", "amount", "description"];

        const taxes = await odooCall("call", {
            model: "account.tax",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100 },
        }, cookie || undefined);

        return NextResponse.json({ status: "success", data: taxes });
    } catch (error: any) {
        console.error("Taxes API Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}
