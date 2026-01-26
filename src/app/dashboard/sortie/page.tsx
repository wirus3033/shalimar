"use client";

import { LogOut, Search, CheckCircle, XCircle } from "lucide-react";

export default function SortiePage() {
    const checkouts = [
        {
            id: 1,
            client: "Jean Dupont",
            room: "101",
            checkIn: "2026-01-24",
            checkOut: "2026-01-27",
            total: "150€",
            paid: true,
            status: "En attente",
        },
        {
            id: 2,
            client: "Marie Martin",
            room: "102",
            checkIn: "2026-01-26",
            checkOut: "2026-01-28",
            total: "160€",
            paid: true,
            status: "Prêt",
        },
        {
            id: 3,
            client: "Pierre Bernard",
            room: "203",
            checkIn: "2026-01-25",
            checkOut: "2026-01-28",
            total: "450€",
            paid: false,
            status: "En attente",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Prêt":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "En attente":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
            case "Terminé":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                {/* <div>
                    <h1>
                        Sorties / Check-out
                    </h1>
                    <p className="mt-1">
                        Gérez les départs des clients
                    </p>
                </div> */}
                {/* <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        Date du jour:
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {new Date().toLocaleDateString("fr-FR")}
                    </span>
                </div> */}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher un départ..."
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                            <LogOut className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Départs aujourd'hui
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {checkouts.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Prêts</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                1
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Paiements en attente
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                1
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkouts List */}
            <div className="space-y-4">
                {checkouts.map((checkout) => (
                    <div
                        key={checkout.id}
                        className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <h3>
                                        {checkout.client}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                                            checkout.status
                                        )}`}
                                    >
                                        {checkout.status}
                                    </span>
                                    {checkout.paid ? (
                                        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                            <CheckCircle className="w-4 h-4" />
                                            Payé
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                            <XCircle className="w-4 h-4" />
                                            Non payé
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400">
                                            Chambre
                                        </p>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {checkout.room}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400">Arrivée</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {new Date(checkout.checkIn).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400">Départ</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {new Date(checkout.checkOut).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400">Total</p>
                                        <p className="font-semibold text-green-600 dark:text-green-400">
                                            {checkout.total}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 ml-6">
                                {!checkout.paid && (
                                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium">
                                        Encaisser
                                    </button>
                                )}
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                                    Check-out
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
