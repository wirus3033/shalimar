"use client";

import { CalendarCheck, Plus, Search, Filter, Eye, Pencil, Trash2, Printer } from "lucide-react";
import Link from "next/link";

export default function ReservationPage() {
    const reservations = [
        {
            id: 1,
            client: "Jean Dupont",
            room: "101",
            checkIn: "2026-01-27",
            checkOut: "2026-01-30",
            status: "Confirmée",
            total: "150€",
        },
        {
            id: 2,
            client: "Marie Martin",
            room: "102",
            checkIn: "2026-01-26",
            checkOut: "2026-01-28",
            status: "En cours",
            total: "160€",
        },
        {
            id: 3,
            client: "Pierre Bernard",
            room: "203",
            checkIn: "2026-01-28",
            checkOut: "2026-02-01",
            status: "Confirmée",
            total: "600€",
        },
        {
            id: 4,
            client: "Sophie Dubois",
            room: "202",
            checkIn: "2026-01-29",
            checkOut: "2026-01-31",
            status: "En attente",
            total: "160€",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Confirmée":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "En cours":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "En attente":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
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
                        Réservations
                    </h1>
                    <p className="mt-1">
                        Gérez toutes vos réservations
                    </p>
                </div> */}
                <Link
                    href="/dashboard/reservation/nouveau"
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />

                </Link>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une réservation..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">Filtrer</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">4</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Confirmées</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">2</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">En cours</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">En attente</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">1</p>
                </div>
            </div>

            {/* Reservations Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Client
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Chambre
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Arrivée
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Départ
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Statut
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Total
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {reservations.map((reservation) => (
                                <tr
                                    key={reservation.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                        {reservation.client}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {reservation.room}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {new Date(reservation.checkIn).toLocaleDateString("fr-FR")}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {new Date(reservation.checkOut).toLocaleDateString("fr-FR")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                                                reservation.status
                                            )}`}
                                        >
                                            {reservation.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                                        {reservation.total}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                                                title="Voir détails"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                title="Modifier"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all"
                                                title="Imprimer"
                                            >
                                                <Printer className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
