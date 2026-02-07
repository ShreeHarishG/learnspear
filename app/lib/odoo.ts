// lib/odoo.ts
// Works with Odoo XML-RPC via /jsonrpc

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL!;
const DB = process.env.NEXT_PUBLIC_ODOO_DB!;
const USERNAME = process.env.NEXT_PUBLIC_ODOO_USERNAME!;
const PASSWORD = process.env.NEXT_PUBLIC_ODOO_PASSWORD!;

type OdooParams = {
    service: string;
    method: string;
    args: any[];
};

async function jsonRpc(params: OdooParams) {
    const response = await fetch(`${ODOO_URL}/jsonrpc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "call",
            params,
            id: Math.floor(Math.random() * 1000),
        }),
    });

    const data = await response.json();
    if (data.error) {
        console.error("Odoo Error:", data.error);
        throw new Error(data.error.data.message);
    }

    return data.result;
}

// Authenticate once and reuse uid
let uidCache: number | null = null;

async function getUid() {
    if (uidCache) return uidCache;

    const uid = await jsonRpc({
        service: "common",
        method: "login",
        args: [DB, USERNAME, PASSWORD],
    });

    uidCache = uid;
    return uid;
}

// Generic executor
async function execute(model: string, method: string, args: any[] = [], kwargs: any = {}) {
    const uid = await getUid();

    return jsonRpc({
        service: "object",
        method: "execute_kw",
        args: [DB, uid, PASSWORD, model, method, args, kwargs],
    });
}

/* ===================== GENERIC HELPERS ===================== */

export async function searchRead(
    model: string,
    domain: any[] = [],
    fields: string[] = []
) {
    return execute(model, "search_read", [domain], { fields });
}

export async function create(model: string, data: any) {
    return execute(model, "create", [data]);
}

export async function write(model: string, id: number, data: any) {
    return execute(model, "write", [[id], data]);
}

export async function callMethod(
    model: string,
    method: string,
    ids: number[] = [],
    args: any[] = []
) {
    return execute(model, method, [ids, ...args]);
}
