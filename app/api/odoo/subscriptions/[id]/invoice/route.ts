
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// POST /api/odoo/subscriptions/[id]/invoice
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const cookie = request.headers.get("cookie");
        const id = parseInt(params.id);

        // 1. Fetch Subscription to get details
        const subs = await odooCall(
            "call",
            {
                model: "subscription.subscription",
                method: "read",
                args: [[id], ["name", "partner_id", "amount_total"]],
                kwargs: {},
            },
            cookie || undefined
        );

        if (!subs || subs.length === 0) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }
        const sub = subs[0];

        // 2. Create Invoice
        const invoiceId = await odooCall(
            "call",
            {
                model: "account.move",
                method: "create",
                args: [
                    {
                        move_type: "out_invoice",
                        partner_id: sub.partner_id[0],
                        invoice_date: new Date().toISOString().split("T")[0],
                        invoice_line_ids: [
                            [
                                0,
                                0,
                                {
                                    name: `Subscription: ${sub.name}`,
                                    quantity: 1,
                                    price_unit: sub.amount_total,
                                },
                            ],
                        ],
                    },
                ],
                kwargs: {},
            },
            cookie || undefined
        );

        // 3. Post (Confirm) Invoice
        if (invoiceId) {
            await odooCall("call", {
                model: "account.move",
                method: "action_post",
                args: [[invoiceId]],
                kwargs: {},
            }, cookie || undefined);
        }

        return NextResponse.json({ id: invoiceId, message: "Invoice Created" });
    } catch (error: any) {
        console.error("Create Subscription Invoice Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
