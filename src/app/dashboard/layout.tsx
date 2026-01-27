"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Home,
    BedDouble,
    CalendarCheck,
    Calendar,
    Users,
    LogOut,
    Bell,
    Sun,
    Moon,
    User,
    Settings,
    ChevronDown,
    ShieldCheck,
    UserCog,
} from "lucide-react";
import authService from "@/services/auth.service";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
        setIsDarkMode(shouldBeDark);
        document.documentElement.classList.toggle("dark", shouldBeDark);

        // Load user info
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        document.documentElement.classList.toggle("dark", newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
    };

    const handleLogout = () => {
        authService.logout();
    };

    const menuItems = [
        {
            name: "Tableau de bord",
            href: "/dashboard",
            icon: Home,
        },
        {
            name: "Chambre",
            href: "/dashboard/chambre",
            icon: BedDouble,
        },
        {
            name: "Reservation",
            href: "/dashboard/reservation",
            icon: CalendarCheck,
        },
        {
            name: "Calendrier",
            href: "/dashboard/calendrier",
            icon: Calendar,
        },
        {
            name: "Client",
            href: "/dashboard/client",
            icon: Users,
        },
        {
            name: "Sortie",
            href: "/dashboard/sortie",
            icon: LogOut,
        },
        {
            name: "Profil",
            href: "/dashboard/profil",
            icon: User,
        },
        {
            name: "Droit d'accès",
            href: "/dashboard/acces",
            icon: ShieldCheck,
        },
        {
            name: "Utilisateur",
            href: "/dashboard/utilisateur",
            icon: UserCog,
        },
    ];


    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
                {/* Logo Section */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">G</span>
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Shalimar Hotel
                        </h1>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>


            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {menuItems.find((item) => item.href === pathname)?.name ||
                                    "Tableau de bord"}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Bienvenue dans votre espace de gestion
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Notification Icon */}
                            <button
                                className="relative p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
                                aria-label="Notifications"
                            >
                                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900"></span>
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 group"
                                aria-label="Changer le thème"
                            >
                                {isDarkMode ? (
                                    <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform duration-300" />
                                ) : (
                                    <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:rotate-12 transition-transform duration-300" />
                                )}
                            </button>

                            {/* User Profile */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
                                    aria-label="Profil utilisateur"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {user ? (
                                                `${user.prenom || user.prénom || ""} ${user.nom || ""}`.trim() || "Utilisateur"
                                            ) : "Utilisateur"}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {user?.profil || user?.Profil || "Connecté"}
                                        </p>
                                    </div>
                                    {/* Debug log to verify user object structure - remove after check */}
                                    {user && console.log("Current stored user:", user)}
                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* User Dropdown */}
                                {isUserMenuOpen && (
                                    <>
                                        {/* Backdrop to close on click outside */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                                            <Link
                                                href="/dashboard/parametres"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                Paramètres
                                            </Link>
                                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Déconnexion
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}
