
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/orders  (Similar to subscriptions but maybe different filter)
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get("partner_id");

        // Filter by state if provided, else default to sale/done
        const stateParam = searchParams.get("state");

        let domain: any[] = [];

        if (stateParam === 'quotation') {
            domain.push(["state", "in", ["draft", "sent"]]);
        } else {
            domain.push(["state", "in", ["sale", "done"]]);
        }

        if (partnerId) {
            domain.push(["partner_id", "=", parseInt(partnerId)]);
        }

        const fields = ["id", "name", "partner_id", "date_order", "amount_total", "state"];

        const orders = await odooCall("call", {
            model: "sale.order",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100, order: "date_order desc" },
        }, cookie || undefined);

        return NextResponse.json({ status: "success", data: orders });
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

        // construct order lines for Odoo
        // (0, 0, { values }) is the magic tuple for creating records in-place
        const orderLines = body.lines.map((line: any) => {
            return [0, 0, {
                product_id: line.product_id,
                product_uom_qty: line.qty || 1
            }];
        });

        const orderId = await odooCall("call", {
            model: "sale.order",
            method: "create",
            args: [{
                partner_id: body.partner_id,
                order_line: orderLines,
            }],
            kwargs: {},
        }, cookie || undefined);

        return NextResponse.json({ id: orderId, status: "success" });

    } catch (error: any) {
        console.error("Create Order Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
