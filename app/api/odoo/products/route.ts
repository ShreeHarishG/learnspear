import { NextRequest, NextResponse } from "next/server";
import { odooCall, odooSearchRead, odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/products
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");

        // Fetch products (product.template)
        // We filter for sale_ok=True to get sellable products
        const domain = [["sale_ok", "=", true]];
        const fields = ["id", "name", "list_price", "description_sale"];

        // Use helper
        const products = await odooSearchRead("product.template", domain, fields, 100, 0, cookie || undefined);

        return NextResponse.json({ status: "success", data: products });
    } catch (error: any) {
        console.error("Products API Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}

// POST /api/odoo/products - Create a new product
export async function POST(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const body = await request.json();

        // Validate basics
        if (!body.name) {
            return NextResponse.json({ error: "Product name is required" }, { status: 400 });
        }

        // Custom backend expects: { name, price, type? }
        const payload = {
            name: body.name,
            price: body.list_price || body.price || 0,
            type: body.detailed_type || 'service'
        };

        // Proxy to custom backend
        const result = await odooFetch("/api/products", "POST", payload, cookie || undefined);
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}
// DELETE /api/odoo/products - Delete a product
export async function DELETE(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const result = await odooCall("call", {
            model: "product.template",
            method: "unlink",
            args: [[Number(id)]],
            kwargs: {},
        }, cookie || undefined);

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error("Delete Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}
