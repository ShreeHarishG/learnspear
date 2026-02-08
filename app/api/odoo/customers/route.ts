import { NextRequest, NextResponse } from "next/server";
import { odooCall, odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/customers
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);

        // Define search payload for the custom generic search endpoint
        const payload = {
            model: "res.partner",
            domain: [["customer_rank", ">", 0]],
            fields: ["id", "name", "email", "phone", "image_128", "street", "city", "country_id"]
        };

        // Use custom generic search endpoint
        const data = await odooFetch("/api/odoo/search", "POST", payload, cookie || undefined);

        return NextResponse.json({ status: "success", data: data });
    } catch (error: any) {
        console.error("Customers API Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}
// DELETE /api/odoo/customers - Delete a customer
export async function DELETE(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
        }

        const result = await odooCall("call", {
            model: "res.partner",
            method: "unlink",
            args: [[Number(id)]],
            kwargs: {},
        }, cookie || undefined);

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error("Delete Customer Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}
