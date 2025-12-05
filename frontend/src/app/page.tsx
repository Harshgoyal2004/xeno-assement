"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, Treemap } from 'recharts';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LogOut, RefreshCw, LayoutDashboard, Map, ShoppingBag, Users, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import IndiaMap from '@/components/IndiaMap';

const API_URL = 'http://localhost:4000/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c', '#d0ed57'];

export default function Dashboard() {
    const { user, logout, tenantId, setTenantId } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalSales: 0, ordersCount: 0, customersCount: 0 });
    const [salesData, setSalesData] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [geoData, setGeoData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [retentionData, setRetentionData] = useState({ oneTime: 0, repeat: 0 });
    const [rfmData, setRfmData] = useState([]);
    const [cartAbandonment, setCartAbandonment] = useState({ totalLostRevenue: 0, abandonedCartsCount: 0 });
    const [aovData, setAovData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const fetchData = async (tid: string) => {
        setLoading(true);
        try {
            let salesUrl = `${API_URL}/analytics/sales-over-time?tenantId=${tid}`;
            let aovUrl = `${API_URL}/analytics/aov-trend?tenantId=${tid}`;

            if (startDate) {
                salesUrl += `&startDate=${startDate}`;
                aovUrl += `&startDate=${startDate}`;
            }
            if (endDate) {
                salesUrl += `&endDate=${endDate}`;
                aovUrl += `&endDate=${endDate}`;
            }

            const [statsRes, salesRes, customersRes, geoRes, catRes, retRes, rfmRes, cartRes, aovRes] = await Promise.all([
                axios.get(`${API_URL}/analytics/stats?tenantId=${tid}`),
                axios.get(salesUrl),
                axios.get(`${API_URL}/analytics/top-customers?tenantId=${tid}`),
                axios.get(`${API_URL}/analytics/geo-distribution?tenantId=${tid}`),
                axios.get(`${API_URL}/analytics/category-sales?tenantId=${tid}`),
                axios.get(`${API_URL}/analytics/customer-retention?tenantId=${tid}`),
                axios.get(`${API_URL}/analytics/rfm-segments?tenantId=${tid}`),
                axios.get(`${API_URL}/analytics/cart-abandonment?tenantId=${tid}`),
                axios.get(aovUrl)
            ]);
            setStats(statsRes.data);
            setSalesData(salesRes.data);
            setTopCustomers(customersRes.data);
            setGeoData(geoRes.data);
            setCategoryData(catRes.data);
            setRetentionData(retRes.data);
            setRfmData(rfmRes.data);
            setCartAbandonment(cartRes.data);
            setAovData(aovRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tenantId) {
            fetchData(tenantId);
        }
    }, [tenantId, startDate, endDate]);

    const handleIngest = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/ingest`, { tenantId });
            if (res.data.tenantId) {
                setTenantId(res.data.tenantId);
                fetchData(res.data.tenantId);
            } else if (tenantId) {
                fetchData(tenantId);
            }
        } catch (error) {
            console.error("Ingestion failed", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    const TabButton = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-background p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center bg-card p-6 rounded-xl shadow-sm border border-border">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Analytics Dashboard</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-muted-foreground">Welcome back, {typeof user === 'string' ? user : user?.email}</p>
                            {tenantId && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user?.email?.includes('xeno') ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {user?.email?.includes('xeno') ? 'Demo Mode' : 'Live Mode'}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2 items-center bg-secondary/50 p-1.5 rounded-lg border border-border">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="text-sm border-none bg-transparent text-foreground focus:ring-0 px-2 py-1"
                            />
                            <span className="text-muted-foreground">-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="text-sm border-none bg-transparent text-foreground focus:ring-0 px-2 py-1"
                            />
                        </div>
                        <button
                            onClick={handleIngest}
                            disabled={loading}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shadow-sm"
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            {tenantId ? 'Sync Data' : 'Start Demo Ingestion'}
                        </button>
                        <button
                            onClick={logout}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 shadow-sm"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 border-b border-border pb-2">
                    <TabButton id="overview" icon={LayoutDashboard} label="Overview" />
                    <TabButton id="geo" icon={Map} label="Geography" />
                    <TabButton id="products" icon={ShoppingBag} label="Products" />
                    <TabButton id="customers" icon={Users} label="Customers" />
                </div>

                {/* Content Area */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <>
                            <div className="grid gap-4 md:grid-cols-4">
                                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background border-blue-100 dark:border-blue-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Revenue</CardTitle>
                                        <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-foreground">₹{stats.totalSales.toLocaleString()}</div>
                                        <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background border-purple-100 dark:border-purple-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Orders</CardTitle>
                                        <ShoppingCart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-foreground">{stats.ordersCount}</div>
                                        <p className="text-xs text-muted-foreground mt-1">+15% from last month</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-background border-green-100 dark:border-green-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Active Customers</CardTitle>
                                        <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-foreground">{stats.customersCount}</div>
                                        <p className="text-xs text-muted-foreground mt-1">+12% new customers</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-background border-red-100 dark:border-red-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Lost Revenue</CardTitle>
                                        <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400 rotate-180" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-foreground">₹{cartAbandonment.totalLostRevenue.toLocaleString()}</div>
                                        <p className="text-xs text-muted-foreground mt-1">{cartAbandonment.abandonedCartsCount} carts abandoned</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Card className="shadow-md">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-primary" />
                                            <CardTitle>Revenue Trend</CardTitle>
                                        </div>
                                        <CardDescription>Daily revenue performance over time</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        <div className="h-[350px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={salesData}>
                                                    <defs>
                                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="#888888"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                    />
                                                    <YAxis
                                                        stroke="#888888"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickFormatter={(value) => `₹${value}`}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="sales"
                                                        stroke="#8884d8"
                                                        fillOpacity={1}
                                                        fill="url(#colorSales)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-md">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-green-500" />
                                            <CardTitle>Average Order Value (AOV)</CardTitle>
                                        </div>
                                        <CardDescription>Daily average spend per order</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        <div className="h-[350px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={aovData}>
                                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="#888888"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                    />
                                                    <YAxis
                                                        stroke="#888888"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tickFormatter={(value) => `₹${value}`}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Avg Order Value']}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="aov"
                                                        stroke="#10b981"
                                                        strokeWidth={2}
                                                        dot={false}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}

                    {/* GEOGRAPHY TAB */}
                    {activeTab === 'geo' && (
                        <div className="grid grid-cols-1 gap-4 h-full">
                            {/* Full-screen Map with Vertical Legend */}
                            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
                                <CardContent className="p-0 h-[600px] relative">
                                    <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur px-3 py-1 rounded-md shadow-sm">
                                        <h3 className="font-semibold text-lg">Sales Map</h3>
                                    </div>
                                    <IndiaMap data={geoData} />
                                </CardContent>
                            </Card>

                            {/* Bar Chart Below */}
                            <Card className="border-none shadow-lg bg-card/50 backdrop-blur">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl">Geographic Distribution</CardTitle>
                                    <CardDescription>Revenue breakdown by city</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={geoData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                            <XAxis
                                                dataKey="city"
                                                stroke="#94a3b8"
                                                tick={{ fill: '#e2e8f0', fontSize: 12 }}
                                                angle={-45}
                                                textAnchor="end"
                                                interval={0}
                                                height={80}
                                            />
                                            <YAxis
                                                stroke="#94a3b8"
                                                tick={{ fill: '#e2e8f0' }}
                                                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                                            />
                                            <Tooltip
                                                cursor={false}
                                                contentStyle={{
                                                    backgroundColor: 'rgba(20, 20, 30, 0.9)',
                                                    border: '1px solid #334155',
                                                    borderRadius: '8px',
                                                    color: '#f8fafc',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                                }}
                                                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                                            />
                                            <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                                                {geoData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* PRODUCTS TAB */}
                    {activeTab === 'products' && (
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>Category Share</CardTitle>
                                    <CardDescription>Distribution of products by category</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[450px] flex flex-col items-center">
                                        <div className="h-[350px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={categoryData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={80}
                                                        outerRadius={120}
                                                        fill="#8884d8"
                                                        paddingAngle={5}
                                                        dataKey="count"
                                                        nameKey="category"
                                                    >
                                                        {categoryData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                                        itemStyle={{ color: 'var(--foreground)' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                                            {categoryData.map((entry: any, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                    <span className="text-sm font-medium text-foreground">{entry.category}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>Category Performance</CardTitle>
                                    <CardDescription>Number of products per category</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={categoryData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    cursor={false}
                                                    contentStyle={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                                />
                                                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* CUSTOMERS TAB */}
                    {activeTab === 'customers' && (
                        <div className="grid gap-6 md:grid-cols-7">
                            <Card className="col-span-3 shadow-md">
                                <CardHeader>
                                    <CardTitle>Customer Retention</CardTitle>
                                    <CardDescription>One-time vs Repeat Buyers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: 'One-time', value: retentionData.oneTime },
                                                { name: 'Repeat', value: retentionData.repeat }
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderRadius: '8px', border: '1px solid var(--border)' }} />
                                                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                                    <Cell fill="#FF8042" />
                                                    <Cell fill="#00C49F" />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="col-span-4 shadow-md">
                                <CardHeader>
                                    <CardTitle>RFM Segments</CardTitle>
                                    <CardDescription>Customer classification by value</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={rfmData} layout="vertical" margin={{ left: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderRadius: '8px', border: '1px solid var(--border)' }} />
                                                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                                    {rfmData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="col-span-7 shadow-md">
                                <CardHeader>
                                    <CardTitle>Top Customers</CardTitle>
                                    <CardDescription>Highest spending customers</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topCustomers.map((customer: any, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {customer.firstName?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{customer.firstName} {customer.lastName}</p>
                                                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-foreground">₹{customer.totalSpent.toLocaleString()}</p>
                                                    <p className="text-sm text-muted-foreground">{customer.ordersCount} orders</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
