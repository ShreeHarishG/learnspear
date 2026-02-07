"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, ShoppingBag, Truck, CheckCircle, Clock } from "lucide-react";
import { useParams } from "next/navigation";
import odooAPI from "@/lib/odoo-api";
import toast from "react-hot-toast";

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
  partner?: {
    name: string;
    street?: string;
    city?: string;
    phone?: string;
    email?: string;
  };
  lines?: OrderLine[];
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    odooAPI
      .getOrders()
      .then((res) => {
          // Handle response variations (array vs object with data)
          const allOrders = Array.isArray(res) ? res : (res?.data || []);
          
          // Find the specific order
          // Note: URL params are strings, API IDs are numbers usually
          const foundOrder = allOrders.find((o: any) => o.id.toString() === id.toString());
          
          if (foundOrder) {
              // Ensure lines property exists even if empty, to prevent crashes
              if (!foundOrder.lines) foundOrder.lines = [];
              
              // Map Partner data if it's a simple array [id, name] from Odoo standard search_read
              if (Array.isArray(foundOrder.partner_id)) {
                  foundOrder.partner = {
                      name: foundOrder.partner_id[1],
                      // We won't have street/city/phone from the list view usually, so defaulting
                      street: "", 
                      city: "", 
                      phone: "" 
                  };
              }
              setOrder(foundOrder);
          } else {
              setOrder(null);
          }
      })
      .catch((err) => {
          console.error(err);
          toast.error("Could not load order details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500">Loading Order...</p>
      </div>
  );

  if (!order) return (
      <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
          <p className="text-slate-500 mt-2">The order you are looking for does not exist or you do not have permission to view it.</p>
          <Link href="/user/orders" className="text-primary hover:underline mt-4 inline-block">Back to Orders</Link>
      </div>
  );

  const steps = [
      { id: 'draft', label: 'Quotation', icon: Clock },
      { id: 'sent', label: 'Sent', icon: CheckCircle },
      { id: 'sale', label: 'Confirmed', icon: ShoppingBag },
      { id: 'done', label: 'Locked/Done', icon: Truck },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.state) > -1 
      ? steps.findIndex(s => s.id === order.state) 
      : (order.state === 'sale' ? 2 : 0); // Default fallback

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Link href="/user/orders" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Order {order.name}</h1>
                <p className="text-slate-500">{new Date(order.date_order).toLocaleString()}</p>
            </div>
        </div>
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                <Printer className="w-4 h-4" /> Print
             </button>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="relative flex justify-between">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 hidden md:block"></div>
              {/* Active Progress */}
              <div 
                className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000 hidden md:block" 
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>

              {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStepIndex;
                  const isCompleted = index < currentStepIndex;

                  return (
                      <div key={step.id} className="relative z-10 flex flex-col items-center bg-white px-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              isActive ? 'bg-white border-green-500 text-green-600 shadow-lg shadow-green-100' : 'bg-slate-50 border-slate-200 text-slate-300'
                          }`}>
                              <Icon className="w-5 h-5" />
                          </div>
                          <span className={`mt-3 text-xs font-bold uppercase tracking-wider ${
                              isActive ? 'text-green-600' : 'text-slate-400'
                          }`}>{step.label}</span>
                      </div>
                  );
              })}
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content: Lines */}
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Order Items</h3>
                    <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded">{order.lines?.length || 0} Items</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="py-3 px-6">Product</th>
                                <th className="py-3 px-6 text-center">Qty</th>
                                <th className="py-3 px-6 text-right">Price</th>
                                <th className="py-3 px-6 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {order.lines && order.lines.length > 0 ? (
                                order.lines.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-slate-900">{item.name}</td>
                                        <td className="py-4 px-6 text-center text-slate-600">{item.quantity}</td>
                                        <td className="py-4 px-6 text-right text-slate-600">₹{item.price_unit.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-right font-bold text-slate-900">₹{item.price_subtotal.toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-400">No items found in this order.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
              </div>

               {/* Notes or Help */}
               <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-blue-800 text-sm">
                   <p className="font-bold mb-1">Need help with this order?</p>
                   <p>Contact our support team at <span className="font-bold underline cursor-pointer">support@mio.com</span> and quote your order number <strong>{order.name}</strong>.</p>
               </div>
          </div>

          {/* Sidebar: Summary & Customer */}
          <div className="space-y-6">
               {/* Summary Card */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-900 mb-6">Order Summary</h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-medium">₹{order.amount_untaxed.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Taxes</span>
                            <span className="font-medium">₹{order.amount_tax.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-slate-100 pt-4 flex justify-between text-lg font-bold text-slate-900">
                            <span>Total</span>
                            <span className="text-primary">₹{order.amount_total.toLocaleString()}</span>
                        </div>
                    </div>
               </div>

               {/* Customer Details */}
               {order.partner && (
                   <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider text-slate-400">Customer</h3>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                {order.partner.name?.[0]}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{order.partner.name}</p>
                                <div className="text-sm text-slate-500 mt-1 space-y-0.5">
                                    {order.partner.street && <p>{order.partner.street}</p>}
                                    {order.partner.city && <p>{order.partner.city}</p>}
                                    {order.partner.phone && <p>{order.partner.phone}</p>}
                                    {order.partner.email && <p className="text-blue-600">{order.partner.email}</p>}
                                </div>
                            </div>
                        </div>
                   </div>
               )}
          </div>
      </div>
    </div>
  );
}
