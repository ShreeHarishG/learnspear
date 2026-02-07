
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/users -> In Odoo terms, we usually mean Customers (res.partner) or System Users (res.users)
// Based on typical Admin needs, let's fetch Customers (res.partner)
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");

        // Search for Partners who are customers
        const domain = [["customer_rank", ">", 0]]; // Standard Odoo way to find customers
        const fields = ["id", "name", "email", "phone", "image_1920"];

        const customers = await odooCall("call", {
            model: "res.partner",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100 }, // Limit to 100 for now
        }, cookie || undefined);

        return NextResponse.json({ status: "success", data: customers });
    } catch (error: any) {
        console.error("Users API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
