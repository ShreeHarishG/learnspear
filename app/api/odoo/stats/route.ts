
import { NextRequest, NextResponse } from "next/server";
import { odooCall } from "@/lib/odoo-server";

// GET /api/odoo/stats
// Aggregates data for the dashboard
export async function GET(request: NextRequest) {
    try {
        const cookie = request.headers.get("cookie");

        // 1. Count Customers
        const customerCount = await odooCall("call", {
            model: "res.partner",
            method: "search_count",
            args: [[["customer_rank", ">", 0]]],
            kwargs: {},
        }, cookie || undefined);

        // 2. Count Sale Orders
        const orderCount = await odooCall("call", {
            model: "sale.order",
            method: "search_count",
            args: [[["state", "in", ["sale", "done"]]]],
            kwargs: {},
        }, cookie || undefined);

        // 3. Count Products
        const productCount = await odooCall("call", {
            model: "product.template",
            method: "search_count",
            args: [[["sale_ok", "=", true]]],
            kwargs: {},
        }, cookie || undefined);

        // 4. Calculate Revenue (Basic approximation from Invoices)
        // Odoo doesn't have a simple 'sum' RPC method easily exposed without read_group
        // We'll use read_group to sum amount_total of posted invoices
        const revenueData = await odooCall("call", {
            model: "account.move",
            method: "read_group",
            args: [
                [["move_type", "=", "out_invoice"], ["state", "=", "posted"]], // Domain
                ["amount_total"], // Fields to read
                [] // Group by (empty for total)
            ],
            kwargs: {},
        }, cookie || undefined);

        const totalRevenue = revenueData?.[0]?.amount_total || 0;

        return NextResponse.json({
            status: "success",
            data: {
                active_subscriptions: orderCount, // Mapping orders to active_subscriptions for now
                total_revenue: totalRevenue,
                total_subscriptions: orderCount,
                paid_invoices: 0, // Need to fetch paid invoices count if required, or let frontend calculate from list
                customers: customerCount,
                products: productCount
            }
        });

    } catch (error: any) {
        console.error("Stats API Error:", error);
        // Return zeros on error to not break dashboard completely
        return NextResponse.json({
            customers: 0,
            orders: 0,
            products: 0,
            revenue: 0,
            error: error.message
        });
    }
}
