"use client";

import { BedDouble, Plus, Search } from "lucide-react";
import Link from "next/link";

export default function ChambrePage() {
    const rooms = [
        { id: 1, number: "101", type: "Simple", status: "Disponible", price: "50" },
        { id: 2, number: "102", type: "Double", status: "Occupée", price: "80" },
        { id: 3, number: "103", type: "Suite", status: "Disponible", price: "150" },
        { id: 4, number: "201", type: "Simple", status: "Maintenance", price: "50" },
        { id: 5, number: "202", type: "Double", status: "Disponible", price: "80" },
        { id: 6, number: "203", type: "Suite", status: "Occupée", price: "150" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Disponible":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "Occupée":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case "Maintenance":
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
                        Gestion des Chambres
                    </h1>
                    <p className="mt-1">
                        Gérez toutes vos chambres et leur disponibilité
                    </p>
                </div> */}
                <Link
                    href="/dashboard/chambre/nouveau"
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                    <Plus className="w-5 h-5" />

                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher une chambre..."
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <BedDouble className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Disponibles</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                            <BedDouble className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Occupées</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">2</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                            <BedDouble className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Maintenance</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">1</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Liste des Chambres
                </h2>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3>
                                    Chambre {room.number}
                                </h3>
                                <p className="text-sm">
                                    {room.type}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                                    room.status
                                )}`}
                            >
                                {room.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {room.price}
                            </span>
                            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
                                Modifier
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
