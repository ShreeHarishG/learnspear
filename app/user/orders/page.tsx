"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import odooAPI from "@/lib/odoo-api";

type Order = {
  id: number;
  name: string;
  date_order: string;
  state: string;
  amount_total: number;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = odooAPI.getUser();
    if (!user?.partner_id) return;

    odooAPI
      .getOrders(user.partner_id)
      .then((res) => setOrders(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-text-muted">Loading orders…</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      <aside className="w-full lg:w-64 space-y-2">
        <Link href="/user/profile" className="block px-4 py-2 rounded-lg text-text-muted hover:bg-slate-100">
          User Details
        </Link>
        <Link href="/user/orders" className="block px-4 py-2 rounded-lg bg-primary text-white font-medium">
          My Orders
        </Link>
      </aside>

      <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Package className="text-primary" /> My Orders
        </h1>

        {orders.length === 0 && (
          <p className="text-text-muted">No orders found.</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-xl p-6 hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">
                    <Link href={`/user/orders/${order.id}`} className="hover:text-primary">
                      {order.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-text-muted">
                    Placed on {order.date_order}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                  {order.state}
                </span>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div className="font-bold text-lg">
                  ₹{order.amount_total}
                </div>
                <Link
                  href={`/user/orders/${order.id}`}
                  className="text-sm font-bold text-primary flex items-center gap-1"
                >
                  View Order <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
