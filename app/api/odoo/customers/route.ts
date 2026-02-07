import { NextRequest, NextResponse } from "next/server";
import { odooSearchRead } from "@/lib/odoo-server";

// GET /api/odoo/customers
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);

        // Basic filtering if needed
        const domain = [["customer_rank", ">", 0]]; // Standard Odoo domain for customers
        const fields = ["id", "name", "email", "phone", "image_128", "street", "city", "country_id"];

        const limit = Number(searchParams.get("limit")) || 100;
        const offset = Number(searchParams.get("offset")) || 0;

        const customers = await odooSearchRead("res.partner", domain, fields, limit, offset, cookie || undefined);

        return NextResponse.json({ status: "success", data: customers });
    } catch (error: any) {
        console.error("Customers API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
