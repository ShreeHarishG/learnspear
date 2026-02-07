import { NextResponse } from 'next/server';

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL!;

export async function GET() {
  try {
    const res = await fetch(`${ODOO_URL}/api/subscriptions`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const json = await res.json();

    // Odoo returns { status, data }
    return NextResponse.json(json.data ?? [], { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
