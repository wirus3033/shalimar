"use client";

import { useState, useEffect, useCallback } from "react";
import {
    TrendingUp,
    CreditCard,
    ShoppingCart,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    LayoutDashboard,
    Search,
    Bell,
    User,
    ChevronDown,
    BedDouble
} from "lucide-react";
import { roomService } from "@/services/room.service";
import { roomStatusService } from "@/services/room-status.service";

// --- Custom UI Components ---

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const width = 200;
    const height = 40;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / (range || 1)) * height;
        return `${x},${y}`;
    }).join(" ");

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10 mt-2 opacity-80">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="animate-draw"
            />
        </svg>
    );
};

const AvailabilityRing = ({ percentage }: { percentage: number }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-32 h-32 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-200 dark:text-slate-800"
                />
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{percentage}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Occupé</span>
            </div>
        </div>
    );
};

// --- Main Page ---

export default function DashboardPage() {
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        occupied: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [rooms, statuses] = await Promise.all([
                roomService.getAll(),
                roomStatusService.getAll()
            ]);

            const availableCount = rooms.filter(r => {
                const status = statuses.find(s => s.idStatus === r.IDstatusChambre);
                const label = status?.libele.toLowerCase() || "";
                return label.includes("disponible") && !label.includes("lib");
            }).length;

            setStats({
                total: rooms.length,
                available: availableCount,
                occupied: rooms.length - availableCount,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mockData = {
        monthly: months.map(m => ({ month: m, revenue: 0, expenses: 0 })),
        revenueHistory: [30, 45, 35, 55, 48, 62, 58],
        expenseHistory: [20, 25, 22, 30, 28, 35, 32],
        purchaseHistory: [10, 15, 12, 18, 14, 20, 18]
    };

    const occupancyRate = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;

    return (
        <div className="min-h-screen space-y-8 animate-in fade-in duration-700 pb-10">
            {/* Minimal Sub-header */}
            <div className="flex items-center justify-between">
                {/* <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Hotel Management</h1>
                </div> */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm cursor-pointer">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Tableau de Bord Quotidien</span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Top Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Financial Cards (3 columns) */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all h-[180px]">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Chiffre d'Affaires</p>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">0 Ar</h2>
                                <p className="text-[10px] font-bold text-green-500 flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="w-3 h-3" /> +12% vs hier
                                </p>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <Sparkline data={mockData.revenueHistory} color="#10b981" />
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all h-[180px]">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Dépenses</p>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">0 Ar</h2>
                                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                                    <ArrowDownRight className="w-3 h-3" /> -5% vs hier
                                </p>
                            </div>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <Sparkline data={mockData.expenseHistory} color="#3b82f6" />
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all h-[180px]">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Achats</p>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">0 Ar</h2>
                                <p className="text-[10px] font-bold text-green-500 flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="w-3 h-3" /> +8% vs hier
                                </p>
                            </div>
                            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                                <ShoppingCart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <Sparkline data={mockData.purchaseHistory} color="#f59e0b" />
                    </div>
                </div>

                {/* Occupancy Section (1 column) */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all h-[180px] flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Disponibilité</p>
                        <BedDouble className="w-4 h-4 text-blue-500" />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                            <AvailabilityRing percentage={isLoading ? 0 : occupancyRate} />
                        </div>
                        <div className="flex flex-col gap-1 pr-2">
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Total</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Dispo</p>
                                <p className="text-sm font-black text-green-500">{stats.available}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Occupé</p>
                                <p className="text-sm font-black text-blue-500">{stats.occupied}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Performance Mensuelle</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <th className="px-8 py-5">Mois</th>
                                <th className="px-8 py-5 text-right">CA</th>
                                <th className="px-8 py-5 text-right">Dépenses et Charges</th>
                                <th className="px-8 py-5 text-right">Bénéfice</th>
                                <th className="px-8 py-5 text-right">Achats</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {months.map((m, i) => (
                                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-default">
                                    <td className="px-8 py-4 font-bold text-slate-900 dark:text-white">{m}</td>
                                    <td className="px-8 py-4 text-right font-black text-slate-900 dark:text-white">0 Ar</td>
                                    <td className="px-8 py-4 text-right font-black text-slate-400">0 Ar</td>
                                    <td className="px-8 py-4 text-right font-black text-green-500">+0 Ar</td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-xs font-bold text-slate-500">0 Ar</span>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
