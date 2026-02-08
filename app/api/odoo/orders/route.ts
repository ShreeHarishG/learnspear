
import { NextRequest, NextResponse } from "next/server";
import { odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/orders
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get("partner_id");
        const state = searchParams.get("state");

        let endpoint = "/api/orders";
        const params = [];
        if (partnerId) params.push(`partner_id=${partnerId}`);
        if (state) params.push(`state=${state}`);
        if (params.length > 0) endpoint += "?" + params.join("&");

        const data = await odooFetch(endpoint, "GET", undefined, cookie || undefined);
        return NextResponse.json({ status: "success", data: data });
    } catch (error: any) {
        console.error("Orders API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/odoo/orders - Create an Order
export async function POST(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const body = await request.json();

        // Expect body: { partner_id: 123, lines: [{ product_id: 1, qty: 1 }] }

        if (!body.partner_id || !body.lines || !Array.isArray(body.lines)) {
            return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
        }

        // Custom backend expects simple JSON: { partner_id: 1, lines: [{ product_id: 1, qty: 1 }] }
        // It handles the Odoo creation magic internally.
        const payload = {
            partner_id: body.partner_id,
            lines: body.lines,
        };

        const result = await odooFetch("/api/orders", "POST", payload, cookie || undefined);
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Create Order Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/odoo/orders
export async function DELETE(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const result = await odooFetch(`/api/orders/${id}`, "DELETE", undefined, cookie || undefined);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
