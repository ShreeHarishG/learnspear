/**
 * API types matching api_Readme.md (Odoo API response structures).
 * All list endpoints return { status: "success", data: T }.
 */

/** GET /api/products - items where sale_ok is true */
export interface OdooProduct {
  id: number;
  name: string;
  list_price: number;
}

/** GET /api/subscriptions - partner_id and plan_id are [id, display_name] */
export interface OdooSubscription {
  id: number;
  name: string;
  partner_id: [number, string];
  plan_id: [number, string];
  state: string;
  amount_total: number;
  start_date: string;
}

/** GET /api/customers - partners with customer_rank > 0 */
export interface OdooCustomer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

/** GET /api/plans */
export interface OdooPlan {
  id: number;
  name: string;
  billing_period: string;
  price: number;
}

/** GET /api/invoices */
export interface OdooInvoice {
  id: number;
  name: string;
  partner_id: [number, string];
  invoice_date: string;
  amount_total: number;
  payment_state: string;
  state: string;
}

/** GET /api/stats - dashboard KPIs */
export interface OdooStats {
  active_subscriptions: number;
  total_revenue: number;
  /** Optional if API extends later */
  total_subscriptions?: number;
  paid_invoices?: number;
}

/** Wrapper for all list/object API responses */
export interface OdooApiResponse<T> {
  status: string;
  data: T;
}
