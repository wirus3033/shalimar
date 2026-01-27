"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, ShieldCheck, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import { profileService, Profile } from "@/services/profile.service";

export default function ProfilPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Delete confirmation state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form state
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [formData, setFormData] = useState({
        libele: ""
    });

    const fetchProfiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await profileService.getAll();
            setProfiles(data);
        } catch (err: unknown) {
            setError("Erreur lors de la récupération des profils");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const handleOpenModal = (profile?: Profile) => {
        if (profile) {
            setEditingProfile(profile);
            setFormData({
                libele: profile.libele || ""
            });
        } else {
            setEditingProfile(null);
            setFormData({ libele: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.libele) return;

        setIsSubmitting(true);
        try {
            if (editingProfile?.IDprofil) {
                await profileService.update(String(editingProfile.IDprofil), formData);
            } else {
                await profileService.create(formData as Profile);
            }
            await fetchProfiles();
            setIsModalOpen(false);
        } catch (err: unknown) {
            setError("Erreur lors de l'enregistrement du profil");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!profileToDelete) return;

        setIsDeleting(true);
        try {
            await profileService.delete(String(profileToDelete));
            await fetchProfiles();
            setIsDeleteModalOpen(false);
            setProfileToDelete(null);
        } catch (err: unknown) {
            setError("Erreur lors de la suppression du profil");
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    const openDeleteModal = (id: number) => {
        setProfileToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const filteredProfiles = profiles.filter(p =>
        p.libele?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Gestion des Profils
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Nouveau Profil</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                    <button onClick={fetchProfiles} className="ml-auto text-xs font-bold underline underline-offset-4">Réessayer</button>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher un profil..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white transition-all shadow-sm"
                />
            </div>

            {/* Profiles List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Libellé
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-10 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" />
                                        <p className="mt-2 text-slate-500">Chargement des profils...</p>
                                    </td>
                                </tr>
                            ) : filteredProfiles.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-10 text-center text-slate-500">
                                        Aucun profil trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredProfiles.map((profil) => (
                                    <tr
                                        key={profil.IDprofil}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="font-medium text-slate-900 dark:text-white">
                                                    {profil.libele}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleOpenModal(profil)}
                                                className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => profil.IDprofil && openDeleteModal(profil.IDprofil)}
                                                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
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

            {/* Add/Edit Profile Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingProfile ? "Modifier le Profil" : "Nouveau Profil"}
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="libele" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Libellé <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="libele"
                                    type="text"
                                    value={formData.libele}
                                    onChange={(e) => setFormData({ ...formData, libele: e.target.value })}
                                    placeholder="Ex: Manager"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {editingProfile ? "Mettre à jour" : "Créer le profil"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                                Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.
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
