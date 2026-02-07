
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

        const fields = ["id", "name", "partner_id", "invoice_date", "amount_total", "state", "payment_state"];

        const invoices = await odooCall("call", {
            model: "account.move",
            method: "search_read",
            args: [domain, fields],
            kwargs: { limit: 100, order: "invoice_date desc" },
        }, cookie || undefined);

        return NextResponse.json({ status: "success", data: invoices });
    } catch (error: any) {
        console.error("Invoices API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
