"use client";

import { Users, Plus, Search, Mail, Phone } from "lucide-react";

export default function ClientPage() {
    const clients = [
        {
            id: 1,
            name: "Jean Dupont",
            email: "jean.dupont@email.com",
            phone: "+33 6 12 34 56 78",
            reservations: 5,
            lastVisit: "2026-01-20",
        },
        {
            id: 2,
            name: "Marie Martin",
            email: "marie.martin@email.com",
            phone: "+33 6 23 45 67 89",
            reservations: 3,
            lastVisit: "2026-01-26",
        },
        {
            id: 3,
            name: "Pierre Bernard",
            email: "pierre.bernard@email.com",
            phone: "+33 6 34 56 78 90",
            reservations: 8,
            lastVisit: "2026-01-15",
        },
        {
            id: 4,
            name: "Sophie Dubois",
            email: "sophie.dubois@email.com",
            phone: "+33 6 45 67 89 01",
            reservations: 2,
            lastVisit: "2026-01-25",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                {/* <div>
                    <h1>
                        Clients
                    </h1>
                    <p className="mt-1">
                        Gérez votre base de clients
                    </p>
                </div> */}
                <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl">
                    <Plus className="w-5 h-5" />

                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher un client..."
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Total Clients
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {clients.length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Clients Actifs
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                2
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Nouveaux ce mois
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                1
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clients.map((client) => (
                    <div
                        key={client.id}
                        className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">
                                        {client.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                </div>
                                <div>
                                    <h3>
                                        {client.name}
                                    </h3>
                                    <p className="text-sm">
                                        {client.reservations} réservation
                                        {client.reservations > 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Mail className="w-4 h-4" />
                                {client.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Phone className="w-4 h-4" />
                                {client.phone}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Dernière visite:{" "}
                                {new Date(client.lastVisit).toLocaleDateString("fr-FR")}
                            </span>
                            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
                                Voir profil
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
