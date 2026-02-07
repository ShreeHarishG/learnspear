
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/orders/[id] - Get Single Order Details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookie = request.headers.get("cookie");

        if (!id) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        const fields = [
            "id", "name", "date_order", "state",
            "amount_untaxed", "amount_tax", "amount_total",
            "partner_id", "order_line"
        ];

        // 1. Fetch Order Header
        console.log(`[API] Fetching Order ID: ${id}`);
        const orderData = await odooCall("call", {
            model: "sale.order",
            method: "read",
            args: [[parseInt(id)], fields],
            kwargs: {},
        }, cookie || undefined);

        console.log(`[API] Order Data Response:`, JSON.stringify(orderData));

        if (!orderData || orderData.length === 0) {
            console.error(`[API] Order ${id} not found in Odoo.`);
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const order = orderData[0];

        // 2. Fetch Order Lines Details
        // order_line is usually an array of IDs in Odoo [1, 2, 3]
        if (order.order_line && order.order_line.length > 0) {
            const lineFields = ["id", "name", "product_uom_qty", "price_unit", "price_subtotal"];
            const linesData = await odooCall("call", {
                model: "sale.order.line",
                method: "read",
                args: [order.order_line, lineFields],
                kwargs: {},
            }, cookie || undefined);

            // Remap keys to frontend friendly names if needed, or just attach
            order.lines = linesData.map((l: any) => ({
                id: l.id,
                name: l.name,
                quantity: l.product_uom_qty,
                price_unit: l.price_unit,
                price_subtotal: l.price_subtotal
            }));
        } else {
            order.lines = [];
        }

        // 3. Fetch Partner Details
        if (order.partner_id && Array.isArray(order.partner_id)) {
            const partnerId = order.partner_id[0];
            const partnerFields = ["name", "street", "city", "phone", "email"];
            const partnerData = await odooCall("call", {
                model: "res.partner",
                method: "read",
                args: [[partnerId], partnerFields],
                kwargs: {},
            }, cookie || undefined);

            if (partnerData && partnerData.length > 0) {
                order.partner = partnerData[0];
            }
        }

        return NextResponse.json({ status: "success", data: order });

    } catch (error: any) {
        console.error("Order Detail API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
