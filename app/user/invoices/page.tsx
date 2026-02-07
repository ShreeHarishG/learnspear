"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import odooAPI from "@/lib/odoo-api";
import { usePathname } from "next/navigation";
import type { OdooInvoice } from "@/lib/odoo-api-types";

export default function UserInvoicesPage() {
  const [invoices, setInvoices] = useState<OdooInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchInvoices() {
      try {
        setLoading(true);

        // Based on your data, Customer 1 is ID 57
        const CUSTOMER_ID = 57;

        const res = await odooAPI.getUserInvoices(CUSTOMER_ID);

        // Handling your specific response structure: { status: "success", data: [...] }
        const data = res?.status === "success" ? res.data : [];

        // Further filter client-side just to be safe
        const customerOneInvoices = data.filter(
          (inv: OdooInvoice) => inv.partner_id[0] === CUSTOMER_ID,
        );

        setInvoices(customerOneInvoices);
      } catch (err) {
        console.error("Failed to load invoices", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  const getStatusConfig = (state: string, paymentState: string) => {
    if (state === "cancel")
      return {
        color: "bg-red-50 text-red-600",
        icon: AlertCircle,
        label: "Cancelled",
      };
    if (paymentState === "paid")
      return {
        color: "bg-green-50 text-green-600",
        icon: CheckCircle,
        label: "Paid",
      };
    if (paymentState === "reversed")
      return {
        color: "bg-orange-50 text-orange-600",
        icon: Clock,
        label: "Reversed",
      };
    if (state === "posted")
      return {
        color: "bg-blue-50 text-blue-600",
        icon: FileText,
        label: "Open",
      };
    return {
      color: "bg-slate-50 text-slate-500",
      icon: FileText,
      label: "Draft",
    };
  };

  const navItems = [
    { name: "Overview", href: "/user" },
    { name: "My Orders", href: "/user/orders" },
    { name: "Invoices", href: "/user/invoices" },
    { name: "Subscriptions", href: "/user/subscriptions" },
    { name: "Profile", href: "/user/profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-10">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 sticky top-24">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-slate-900 text-white shadow-md"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                My Invoices
              </h1>
              <p className="text-slate-500 mt-2">
                View and download your past invoices.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse"
                ></div>
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No invoices found
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-2">
                You don't have any invoices yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {invoices.map((inv) => {
                const status = getStatusConfig(inv.state, inv.payment_state);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={inv.id}
                    className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:shadow-slate-200/50 hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${status.color} bg-opacity-20`}
                      >
                        <StatusIcon className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-slate-900">
                            {inv.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                          {inv.invoice_date}
                          <span className="mx-2 text-slate-300">•</span>
                          {inv.partner_id?.[1] || "Unknown Customer"}
                        </p>
                      </div>

                      <div className="text-center sm:text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                          Amount
                        </p>
                        <p className="text-xl font-bold text-slate-900">
                          ₹{Number(inv.amount_total).toLocaleString()}
                        </p>
                      </div>

                      <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                        <button className="w-full sm:w-auto px-6 py-2.5 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 font-medium rounded-xl transition-all duration-300">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
