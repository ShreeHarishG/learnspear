
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/invoices
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");
        const { searchParams } = new URL(request.url);
        const partnerId = searchParams.get("partner_id");

        // Filter for Customer Invoices (move_type = out_invoice)
        const domain: any[] = [["move_type", "=", "out_invoice"]];

        if (partnerId) {
            domain.push(["partner_id", "=", parseInt(partnerId)]);
        }

        // Exclude Cancelled if desired, or keep all
        // domain.push(["state", "!=", "cancel"]);

        const fields = ["id", "name", "partner_id", "invoice_date", "amount_untaxed", "amount_tax", "amount_total", "state", "payment_state", "invoice_line_ids"];

        const invoices = await odooCall("call", {
            model: "account.move",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100, order: "invoice_date desc" },
        }, cookie || undefined);

        // Fetch Invoice Lines
        const allLineIds = invoices.reduce((acc: number[], inv: any) => {
            return acc.concat(inv.invoice_line_ids || []);
        }, []);

        if (allLineIds.length > 0) {
            const lineFields = ["move_id", "name", "quantity", "price_unit", "price_subtotal"];
            const lines = await odooCall("call", {
                model: "account.move.line",
                method: "read",
                args: [allLineIds, lineFields],
                kwargs: {},
            }, cookie || undefined);

            // Group lines by move_id (invoice id)
            const linesByInvoice: Record<number, any[]> = {};
            lines.forEach((line: any) => {
                const invId = line.move_id[0];
                if (!linesByInvoice[invId]) linesByInvoice[invId] = [];
                linesByInvoice[invId].push({
                    id: line.id,
                    name: line.name,
                    quantity: line.quantity,
                    price_unit: line.price_unit,
                    price_subtotal: line.price_subtotal
                });
            });

            // Attach lines to invoices
            invoices.forEach((inv: any) => {
                inv.lines = linesByInvoice[inv.id] || [];
            });
        }

        return NextResponse.json({ status: "success", data: invoices });
    } catch (error: any) {
        console.error("Invoices API Error:", error);
        return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    }
}
