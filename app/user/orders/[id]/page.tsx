"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import odooAPI from "@/lib/odoo-api";

type OrderLine = {
  id: number;
  name: string;
  quantity: number;
  price_unit: number;
  price_subtotal: number;
};

type Order = {
  id: number;
  name: string;
  date_order: string;
  state: string;
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  partner: {
    name: string;
    street: string;
    city: string;
    phone: string;
  };
  lines: OrderLine[];
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    odooAPI
      .getOrderById(id)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-text-muted">Loading order...</div>;
  if (!order) return <div className="p-8">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/user/orders" className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Order {order.name}</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-bold mb-4">Products</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Product</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Unit</th>
              <th className="text-right py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l) => (
              <tr key={l.id} className="border-b">
                <td className="py-2">{l.name}</td>
                <td className="py-2 text-center">{l.quantity}</td>
                <td className="py-2 text-right">₹{l.price_unit}</td>
                <td className="py-2 text-right">₹{l.price_subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Untaxed</span>
              <span>₹{order.amount_untaxed}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.amount_tax}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span className="text-primary">₹{order.amount_total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
