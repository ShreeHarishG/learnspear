'use client';

import { useState, useEffect } from 'react';
import odooAPI from '@/lib/odoo-api';
import Link from 'next/link';

interface Stats {
  active_subscriptions: number;
  total_subscriptions: number;
  paid_invoices: number;
  total_revenue: number;
}

interface Subscription {
  id: number;
  name: string;
  partner_id: [number, string];
  plan_id: [number, string];
  state: string;
  amount_total: number;
}

interface Invoice {
  id: number;
  name: string;
  partner_id: [number, string];
  invoice_date: string;
  payment_state: string;
  amount_total: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, subsData, invoicesData] = await Promise.all([
        odooAPI.getStats(),
        odooAPI.getSubscriptions(),
        odooAPI.getInvoices(),
      ]);

      setStats(statsData.data);
      setSubscriptions(subsData.data);
      setInvoices(invoicesData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Subscription Management System
          </h1>
          <p className="text-gray-600 mt-2">
            Powered by Odoo Backend + Next.js Frontend
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <nav className="flex space-x-4">
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">
              Dashboard
            </Link>
            <Link href="/subscriptions" className="px-4 py-2 hover:bg-gray-100 rounded">
              Subscriptions
            </Link>
            <Link href="/products" className="px-4 py-2 hover:bg-gray-100 rounded">
              Products
            </Link>
            <Link href="/invoices" className="px-4 py-2 hover:bg-gray-100 rounded">
              Invoices
            </Link>
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Active Subscriptions</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {stats?.active_subscriptions ?? 0}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Subscriptions</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {stats?.total_subscriptions || 0}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Paid Invoices</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">
              {stats?.paid_invoices || 0}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">
              ${stats?.total_revenue?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Recent Subscriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subscription #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.slice(0, 5).map((sub) => (
                  <tr key={sub.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {sub.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sub.partner_id[1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sub.plan_id[1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sub.state === 'active' ? 'bg-green-100 text-green-800' :
                        sub.state === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sub.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${sub.amount_total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Recent Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.slice(0, 5).map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {invoice.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {invoice.partner_id[1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {invoice.invoice_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        invoice.payment_state === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.payment_state === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.payment_state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${invoice.amount_total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}