// app/api/odoo/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

// Get your backend URL from env, or default to localhost
const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || "http://localhost:8069";

async function handler(
  request: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  const params = await props.params;
  // 1. Reconstruct the URL (e.g., /api/odoo/stats -> http://localhost:8069/api/stats)
  const pathArray = params.path;
  const path = pathArray.join("/");
  const queryString = request.nextUrl.search;
  const targetUrl = `${ODOO_URL}/api/${path}${queryString}`;

  // 2. Prepare headers (Forward cookies for authentication)
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  const cookie = request.headers.get("cookie");
  if (cookie) {
    headers.set("Cookie", cookie);
  }

  try {
    // 3. Forward the request to Odoo
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body, // Forward data (for POST/PUT)
      // @ts-ignore
      duplex: "half",
    });

    // 4. Handle the response
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // 5. Send back to Frontend
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // Pass login cookies back to the browser
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

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };