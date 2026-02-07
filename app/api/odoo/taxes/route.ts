
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/taxes
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");

        // Fetch Taxes (account.tax)
        const domain: any[] = [];
        const fields = ["id", "name", "amount", "amount_type", "type_tax_use"];

        const taxes = await odooCall("call", {
            model: "account.tax",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100 },
        }, cookie || undefined);

        const formattedTaxes = taxes.map((t: any) => ({
            id: t.id,
            name: t.name,
            type: t.amount_type, // 'percent', 'fixed'
            rate: t.amount + (t.amount_type === 'percent' ? '%' : ''),
            scope: t.type_tax_use // 'sale', 'purchase'
        }));

        return NextResponse.json({ status: "success", data: formattedTaxes });
    } catch (error: any) {
        console.error("Taxes API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
