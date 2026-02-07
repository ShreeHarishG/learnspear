// app/api/odoo/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

// 1. Get the real Odoo URL from env
const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || "http://localhost:8069";

async function handler(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // 2. Reconstruct the destination URL
  // Example: Client requests /api/odoo/invoices -> We fetch ODOO_URL/api/invoices
  const path = (await params).path.join("/");
  const queryString = request.nextUrl.search;
  const targetUrl = `${ODOO_URL}/api/${path}${queryString}`;

  // 3. Prepare Headers (CRITICAL: Forward Cookies)
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  
  // Forward the session cookie from the browser to Odoo
  const cookie = request.headers.get("cookie");
  if (cookie) {
    headers.set("Cookie", cookie);
  }

  try {
    // 4. Fetch data from Odoo
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body, // Forward request body (for POST/PUT)
      // @ts-ignore - Required for forwarding body in some Next.js environments
      duplex: "half", 
    });

    // 5. Read response from Odoo
    // We try to parse JSON, or fallback to text if it fails
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    // 6. Create Response to send back to Frontend
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // 7. CRITICAL: Forward 'Set-Cookie' from Odoo back to Browser
    // This ensures the user stays logged in
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      nextResponse.headers.set("Set-Cookie", setCookie);
    }

    return nextResponse;

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Proxy connection failed" }, { status: 500 });
  }
}

// Export handler for all HTTP methods
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };