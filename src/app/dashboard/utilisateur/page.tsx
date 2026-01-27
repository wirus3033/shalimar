"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Plus, Search, Mail, Phone, Shield, UserCog, Loader2, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { userService, UserData } from "@/services/user.service";
import { profileService, Profile } from "@/services/profile.service";

export default function UtilisateurPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Delete confirmation state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [usersData, profilesData] = await Promise.all([
                userService.getAll(),
                profileService.getAll()
            ]);
            setUsers(usersData);
            setProfiles(profilesData);
        } catch (err: unknown) {
            console.error("Failed to fetch data:", err);
            setError("Erreur lors de la récupération des données");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            await userService.delete(userToDelete);
            await fetchData();
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (err: unknown) {
            console.error("Failed to delete user:", err);
            setError("Erreur lors de la suppression de l'utilisateur");
        } finally {
            setIsDeleting(false);
        }
    };

    const openDeleteModal = (id: number) => {
        setUserToDelete(id);
        setIsDeleteModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredUsers = users.filter(u =>
        u.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getProfileLabel = (id: string | number | undefined) => {
        if (!id) return "Inconnu";
        const profile = profiles.find(p =>
            String(p.IDprofil) === String(id)
        );
        return profile ? profile.libele : "Inconnu";
    };

    const stats = {
        total: users.length,
        admins: users.filter(u => {
            const label = getProfileLabel(u.IDprofil);
            return label.toLowerCase() === "administrateur";
        }).length,
        connected: 1
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Liste des Utilisateurs
                </h1>
                <Link href="/dashboard/utilisateur/nouveau">
                    <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl">
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline font-semibold">Nouveau Utilisateur</span>
                    </button>
                </Link>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                    <button onClick={fetchData} className="ml-auto text-xs font-bold underline underline-offset-4">Réessayer</button>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher par nom, prénom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white transition-all shadow-sm"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Total Utilisateurs
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {isLoading ? "..." : stats.total}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Administrateurs
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {isLoading ? "..." : stats.admins}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <UserCog className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Connectés
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.connected}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Utilisateur
                                </th>
                                {/* <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Email
                                </th> */}
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Profil
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Téléphone
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" />
                                        <p className="mt-2 text-slate-500">Chargement des utilisateurs...</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                                        Aucun utilisateur trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                                    {user.nom.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                        {user.prenom} {user.nom}
                                                    </div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email || "Pas d'email"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                                {user.email || "---"}
                                            </span>
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {getProfileLabel(user.IDprofil)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {user.telephone || "---"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                                title="Voir"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <Link href={`/dashboard/utilisateur/nouveau?id=${user.IDutilisateur}`}>
                                                <button
                                                    className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => user.IDutilisateur && openDeleteModal(user.IDutilisateur)}
                                                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:scale-110">
                                <Trash2 className="w-10 h-10 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                Confirmer la suppression
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">
                                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={isDeleting}
                                    className="flex-1 px-6 py-3 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-700 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Supprimer"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
