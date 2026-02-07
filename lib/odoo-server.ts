
import axios from 'axios';

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || "http://localhost:8069";
const ODOO_DB = process.env.NEXT_PUBLIC_ODOO_DB || "odoo";

// Helper function to make JSON-RPC calls 
// This runs on the Next.js SERVER, so no CORS issues with Odoo
export async function odooCall(method: string, params: any, cookie?: string) {
    const url = `${ODOO_URL}/web/dataset/call_kw`;

    const headers: any = {
        'Content-Type': 'application/json',
    };

    if (cookie) {
        headers['Cookie'] = cookie;
    }

    const payload = {
        jsonrpc: "2.0",
        method: "call",
        params: params,
        id: Math.floor(Math.random() * 1000000000),
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.error) {
            console.error("Odoo RPC Error:", data.error);
            throw new Error(data.error.data?.message || data.error.message || "Odoo Error");
        }

        return data.result;
    } catch (error: any) {
        console.error("Odoo Fetch Error:", error.message);
        throw error;
    }
}

// Helper for "search_read" - the most common operation
export async function odooSearchRead(model: string, domain: any[] = [], fields: string[] = [], limit: number = 0, offset: number = 0, cookie?: string) {
    return odooCall("call", {
        model: model,
        method: "search_read",
        args: [domain, fields],
        kwargs: {
            limit: limit,
            offset: offset
        }
    }, cookie);
}
