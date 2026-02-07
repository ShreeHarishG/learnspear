
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/settings
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");

        // Fetch Company Info (res.company)
        // We get the main company (id 1 usually, or search)
        const domain: any[] = [];
        const fields = ["id", "name", "email", "phone", "currency_id"];

        const companies = await odooCall("call", {
            model: "res.company",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 1 },
        }, cookie || undefined);

        const company = companies[0] || {};

        return NextResponse.json({
            status: "success",
            data: {
                company_name: company.name,
                email: company.email,
                phone: company.phone,
                currency: company.currency_id?.[1]
            }
        });
    } catch (error: any) {
        console.error("Settings API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
