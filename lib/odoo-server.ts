
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

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Odoo Non-JSON Response:", text.substring(0, 200));
            const err: any = new Error(`Odoo returned non-JSON response: ${response.status} ${response.statusText}`);
            err.status = response.status;
            throw err;
        }

        if (data.error) {
            console.error("Odoo RPC Error:", data.error);
            const err: any = new Error(data.error.data?.message || data.error.message || "Odoo Error");
            err.status = 500; // RPC errors are usually business logic failures
            throw err;
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

// Generic helper for REST-like endpoints (e.g. /api/products, /api/subscriptions)
// This is used when the Odoo backend exposes custom controllers
export async function odooFetch(endpoint: string, method: string = "GET", body?: any, cookie?: string) {
    const url = `${ODOO_URL}${endpoint}`;

    const headers: any = {
        'Content-Type': 'application/json',
    };

    if (cookie) {
        headers['Cookie'] = cookie;
    }

    const options: RequestInit = {
        method: method,
        headers: headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        // Handle empty responses (like 204 No Content for DELETE)
        if (response.status === 204) return null;

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error(`Odoo Non-JSON Response (${endpoint}):`, text.substring(0, 200));
            const err: any = new Error(`Odoo returned non-JSON response: ${response.status} ${response.statusText}`);
            err.status = response.status;
            throw err;
        }

        // Check for Odoo-style errors or HTTP errors
        if (!response.ok) {
            const err: any = new Error(data.error || data.message || `HTTP Error ${response.status}`);
            err.status = response.status;
            throw err;
        }

        if (data.error) {
            const err: any = new Error(data.error);
            err.status = 400; // Assume bad request/logic error if Odoo returns error object in 200 OK
            throw err;
        }

        return data;
    } catch (error: any) {
        console.error(`Odoo Fetch Error (${endpoint}):`, error.message);
        throw error;
    }
}
