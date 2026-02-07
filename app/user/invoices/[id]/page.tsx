"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import odooAPI from "@/lib/odoo-api";

type InvoiceLine = {
  id: number;
  name: string;
  quantity: number;
  price_unit: number;
  price_subtotal: number;
};

type Invoice = {
  id: number;
  name: string;
  invoice_date: string;
  payment_state: string;
  partner: {
    name: string;
    email: string;
    address: string;
  };
  lines: InvoiceLine[];
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
};

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    odooAPI
      .getInvoiceById(id)
      .then((res) => setInvoice(res.data))
      .catch(() => setError("Failed to load invoice"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-text-muted">Loading invoice...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!invoice) return <div className="p-8">Invoice not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/user/invoices" className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <h1 className="text-2xl font-bold">Invoice {invoice.name}</h1>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            invoice.payment_state === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {invoice.payment_state}
        </span>
      </div>

      <div className="bg-white p-8 rounded-xl border">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-text-muted">Invoice Date</p>
            <p className="font-semibold">{invoice.invoice_date}</p>
          </div>

          <div className="md:text-right">
            <p className="font-bold">{invoice.partner.name}</p>
            <p className="text-sm">{invoice.partner.address}</p>
            <p className="text-sm text-primary">{invoice.partner.email}</p>
          </div>
        </div>

        <table className="w-full text-sm border-t">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Unit</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line) => (
              <tr key={line.id} className="border-b">
                <td className="py-2">{line.name}</td>
                <td className="py-2 text-center">{line.quantity}</td>
                <td className="py-2 text-right">₹{line.price_unit}</td>
                <td className="py-2 text-right">₹{line.price_subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Untaxed</span>
              <span>₹{invoice.amount_untaxed}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{invoice.amount_tax}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span className="text-primary">₹{invoice.amount_total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
