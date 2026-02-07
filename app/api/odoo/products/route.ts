
import { NextRequest, NextResponse } from "next/server";
import { odooCall, odooSearchRead } from "@/lib/odoo-server";

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
        return NextResponse.json({ error: error.message }, { status: 500 });
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

        // Prepare Odoo creation payload
        const productData = {
            name: body.name,
            list_price: body.list_price || 0,
            sale_ok: true,
            detailed_type: 'service', // Default to service/subscription type for this SaaS
            // Add more fields as needed
        };

        const newProductId = await odooCall("call", {
            model: "product.template",
            method: "create",
            args: [productData],
            kwargs: {},
        }, cookie || undefined);

        return NextResponse.json({ id: newProductId, ...productData, status: "success" });

    } catch (error: any) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
