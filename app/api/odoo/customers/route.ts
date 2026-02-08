import { NextRequest, NextResponse } from "next/server";
import { odooSearchRead, odooCall } from "@/lib/odoo-server";

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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
