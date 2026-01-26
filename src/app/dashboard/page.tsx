"use client";

import { BarChart3, TrendingUp, Users, FolderKanban } from "lucide-react";

export default function DashboardPage() {
    const stats = [
        {
            title: "Total Projets",
            value: "24",
            change: "+12%",
            icon: FolderKanban,
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Clients Actifs",
            value: "156",
            change: "+8%",
            icon: Users,
            color: "from-green-500 to-green-600",
        },
        {
            title: "Revenus",
            value: "45,230€",
            change: "+23%",
            icon: TrendingUp,
            color: "from-purple-500 to-purple-600",
        },
        {
            title: "Taux de Croissance",
            value: "18.5%",
            change: "+5%",
            icon: BarChart3,
            color: "from-orange-500 to-orange-600",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            {/* <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-2xl p-8 text-white shadow-xl">
                <h1>
                    Bienvenue sur votre tableau de bord !
                </h1>
                <p className="text-green-100">
                    Voici un aperçu de vos activités et performances
                </p>
            </div> */}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                                >
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                {stat.title}
                            </h3>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Placeholder Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <h3>
                        Activités Récentes
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {item}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Activité #{item}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Il y a {item} heure{item > 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                    <h3>
                        Actions Rapides
                    </h3>
                    <div className="space-y-3">
                        {[
                            "Créer un nouveau projet",
                            "Ajouter un client",
                            "Générer un rapport",
                        ].map((action, index) => (
                            <button
                                key={index}
                                className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white text-slate-700 dark:text-slate-300 font-medium transition-all duration-200 hover:shadow-lg"
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
