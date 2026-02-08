
import { NextRequest, NextResponse } from "next/server";
import { odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/plans
// GET /api/odoo/plans
export async function GET(request: NextRequest) {
    // Mock Plans for now as Odoo Community doesn't have subscription plans by default
    const mockPlans = [
        { id: 1, name: "Basic Plan", billing_period: "month", price: 999 },
        { id: 2, name: "Pro Plan", billing_period: "month", price: 1999 },
        { id: 3, name: "Enterprise Plan", billing_period: "year", price: 19999 },
    ];
    return NextResponse.json({ status: "success", data: mockPlans });
}
