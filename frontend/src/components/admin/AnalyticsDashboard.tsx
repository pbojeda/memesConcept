'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/adminApi';
import { useState } from 'react';
import { DollarSign, ShoppingCart, Activity, MousePointerClick, Filter } from 'lucide-react';
import { Product } from '@/schemas/product';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function AnalyticsDashboard() {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [productId, setProductId] = useState<string>('');

    const { data: analytics, isLoading } = useQuery({
        queryKey: ['analytics', startDate, endDate, productId],
        queryFn: () => adminApi.getAnalytics({ startDate, endDate, productId })
    });

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => adminApi.getProducts()
    });

    if (isLoading || !analytics) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Analytics...</div>;

    const stats = [
        { title: 'Total Revenue', value: `$${analytics.totalRevenue.toFixed(2)}`, icon: DollarSign },
        { title: 'Total Orders', value: analytics.totalOrders, icon: ShoppingCart },
        { title: 'Page Views', value: analytics.funnelMetrics.pageViews, icon: Activity },
        { title: 'Conversion Rate', value: `${analytics.funnelMetrics.conversionRate}%`, icon: MousePointerClick },
    ];

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
                <div className="flex items-center gap-2 text-gray-500 mr-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wider">Filters</span>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-3 py-1.5 text-sm" />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-3 py-1.5 text-sm" />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Product</label>
                    <select value={productId} onChange={(e) => setProductId(e.target.value)} className="border rounded px-3 py-1.5 text-sm bg-white min-w-[200px]">
                        <option value="">All Products</option>
                        {products?.map((p: Product) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-violet-100 text-violet-600 rounded-lg">
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue / Orders Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-bold mb-6 text-gray-800">Revenue & Orders Over Time</h3>
                <div className="h-[300px] w-full">
                    {analytics.revenueOverTime && analytics.revenueOverTime.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.revenueOverTime} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `$${value}`} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            No data for this period
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Funnel */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6 text-gray-800">Sales Funnel</h3>
                    <div className="space-y-4">
                        <FunnelStep label="Page Views" value={analytics.funnelMetrics.pageViews} max={analytics.funnelMetrics.pageViews} color="bg-blue-100 text-blue-800" barColor="bg-blue-500" />
                        <FunnelStep label="Checkouts Initiated" value={analytics.funnelMetrics.checkoutsInitiated} max={analytics.funnelMetrics.pageViews} color="bg-indigo-100 text-indigo-800" barColor="bg-indigo-500" />
                        <FunnelStep label="Purchases Completed" value={analytics.funnelMetrics.purchasesCompleted} max={analytics.funnelMetrics.pageViews} color="bg-violet-100 text-violet-800" barColor="bg-violet-500" />
                    </div>
                </div>

                {/* Top Products */}
                {!productId && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-6 text-gray-800">Top Products</h3>
                        {analytics.topProducts.length > 0 ? (
                            <div className="h-[250px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.topProducts} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="productName" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} interval={0}
                                            tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} allowDecimals={false} />
                                        <RechartsTooltip
                                            cursor={{ fill: '#F3F4F6' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="salesCount" name="Sales" radius={[4, 4, 0, 0]}>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {analytics.topProducts.map((_: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm flex items-center h-[250px] justify-center">No sales data available yet.</p>
                        )}
                    </div>
                )}

                {/* Traffic Sources */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-6 text-gray-800">Traffic Sources</h3>
                    {analytics.trafficSources.length > 0 ? (
                        <div className="space-y-3">
                            {analytics.trafficSources.map((t: { source: string; visits: number }, i: number) => (
                                <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                                    <span className="font-medium text-gray-700 capitalize">{t.source}</span>
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">{t.visits} visits</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No traffic data available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function FunnelStep({ label, value, max, color, barColor }: { label: string, value: number, max: number, color: string, barColor: string }) {
    const percentage = max > 0 ? (value / max) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between mb-1 text-sm font-medium">
                <span className="text-gray-700">{label}</span>
                <span className={`px-2 py-0.5 rounded ${color}`}>{value}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${barColor} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
