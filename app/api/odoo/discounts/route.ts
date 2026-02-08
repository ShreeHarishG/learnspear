
import { NextRequest, NextResponse } from "next/server";
import { odooFetch } from "@/lib/odoo-server";

// GET /api/odoo/discounts
// GET /api/odoo/discounts
export async function GET(request: NextRequest) {
    // Mock Discounts
    const mockDiscounts = [
        { id: 1, name: "Welcome Offer", percentage: 10, code: "WELCOME10" },
        { id: 2, name: "Summer Sale", percentage: 20, code: "SUMMER20" },
    ];
    return NextResponse.json({ status: "success", data: mockDiscounts });
}
