"use client";

import { useOdooPolling } from "@/lib/hooks/useOdooPolling";
import odooAPI from "@/lib/odoo-api";
import { OdooStatusBar } from "@/components/ui/OdooStatusBar";
import { OdooFormLayout } from "@/components/ui/OdooFormLayout";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Check, FileText } from "lucide-react";

// Mock stages for now - Odoo has specific stages
const SUBSCRIPTION_STAGES = ["draft", "sent", "sale", "done", "cancel"];

export default function SubscriptionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    // In a real app we'd fetch a single item, but here we filter from list
    // TO-DO: Implement getSubscriptionById in API
    const { data: list, loading } = useOdooPolling<any[]>(odooAPI.getSubscriptions);
    const [subscription, setSubscription] = useState<any>(null);

    useEffect(() => {
        if (list) {
            const found = list.find((s) => s.id === id);
            setSubscription(found);
        }
    }, [list, id]);

    if (!subscription && loading) return <div className="p-8">Loading...</div>;
    if (!subscription && !loading) return <div className="p-8">Subscription not found</div>;

    const handleStageClick = (stage: string) => {
        // Here we would call API to update stage
        console.log("Move to stage:", stage);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
             {/* Header Section */}
             <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <nav className="flex items-center text-sm font-medium text-slate-500">
                             <span className="hover:text-slate-700 cursor-pointer" onClick={() => router.push('/admin/subscriptions')}>
                                 Subscriptions
                             </span>
                             <span className="mx-2">/</span>
                             <span className="text-slate-900">{subscription.name}</span>
                        </nav>
                     </div>
                     
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            {/* Action Buttons */}
                            {subscription.state === 'draft' && (
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                    Confirm Subscription
                                </button>
                            )}
                            {subscription.state === 'sale' && (
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                    Create Invoice
                                </button>
                            )}
                            <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                Send by Email
                            </button>
                             <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors">
                                Cancel
                            </button>
                         </div>
                         
                         {/* Status Bar */}
                         <div className="flex items-center border rounded-md overflow-hidden text-sm font-medium">
                             {SUBSCRIPTION_STAGES.map((stage, idx) => {
                                 const isCurrent = subscription.state === stage;
                                 const isPast = SUBSCRIPTION_STAGES.indexOf(subscription.state) > idx;
                                 
                                 return (
                                     <div 
                                        key={stage}
                                        className={`
                                            px-4 py-2 border-r last:border-r-0 flex items-center capitalize
                                            ${isCurrent ? 'bg-blue-600 text-white' : ''}
                                            ${isPast ? 'bg-blue-50 text-blue-700' : ''}
                                            ${!isCurrent && !isPast ? 'bg-white text-slate-500' : ''}
                                        `}
                                     >
                                         {stage === 'sale' ? 'Running' : stage}
                                     </div>
                                 )
                             })}
                         </div>
                     </div>
                </div>
            </div>

            {/* Main Form Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="mx-auto max-w-5xl bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden min-h-[600px]">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-8">{subscription.name}</h1>
                        
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Customer</label>
                                    <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
                                        {subscription.partner_id?.[1]}
                                    </div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Recurring Plan</label>
                                    <div className="text-sm text-slate-700">
                                        {subscription.plan_id?.[1] || "Monthly"}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Column */}
                             <div className="space-y-4">
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Start Date</label>
                                    <div className="text-sm text-slate-700">
                                        {subscription.date_start || subscription.create_date?.split(" ")[0]}
                                    </div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-slate-900">Next Invoice</label>
                                    <div className="text-sm text-slate-700 font-medium">
                                        {/* Mock */}
                                        {new Date().toISOString().split("T")[0]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs / Lines Section */}
                        <div className="mt-12">
                             <div className="border-b border-slate-200 flex gap-6 mb-6">
                                 <button className="border-b-2 border-blue-600 pb-2 text-sm font-medium text-blue-600">
                                     Order Lines
                                 </button>
                                 <button className="border-b-2 border-transparent pb-2 text-sm font-medium text-slate-500 hover:text-slate-700">
                                     Other Info
                                 </button>
                             </div>
                             
                             {/* Order Lines Table */}
                             <table className="w-full text-left text-sm">
                                 <thead>
                                     <tr className="border-b border-slate-200">
                                         <th className="py-2 font-medium text-slate-900">Product</th>
                                         <th className="py-2 font-medium text-slate-900 text-right">Quantity</th>
                                         <th className="py-2 font-medium text-slate-900 text-right">Unit Price</th>
                                         <th className="py-2 font-medium text-slate-900 text-right">Subtotal</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     <tr className="border-b border-slate-100">
                                         <td className="py-3 text-slate-700">
                                             {/* Mock Product Line since we don't have lines in the poller data yet */}
                                             [Product] Service Subscription
                                         </td>
                                         <td className="py-3 text-right text-slate-700">1.00</td>
                                         <td className="py-3 text-right text-slate-700">
                                             {Number(subscription.recurring_total || subscription.amount_total).toFixed(2)}
                                         </td>
                                          <td className="py-3 text-right text-slate-700 font-medium">
                                             {Number(subscription.recurring_total || subscription.amount_total).toFixed(2)}
                                         </td>
                                     </tr>
                                 </tbody>
                                 <tfoot>
                                     <tr>
                                         <td colSpan={3} className="pt-4 text-right font-bold text-slate-900">Total</td>
                                         <td className="pt-4 text-right font-bold text-slate-900">
                                              {Number(subscription.recurring_total || subscription.amount_total).toFixed(2)}
                                         </td>
                                     </tr>
                                 </tfoot>
                             </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
