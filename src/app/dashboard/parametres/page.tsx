"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Settings,
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Database
} from "lucide-react";
import { roomStatusService, RoomStatus } from "@/services/room-status.service";

export default function ParametresPage() {
    const [statuses, setStatuses] = useState<RoomStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState<RoomStatus | null>(null);
    const [formData, setFormData] = useState({ libele: "" });

    // Delete confirmation modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchStatuses = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await roomStatusService.getAll();
            setStatuses(data);
        } catch (err: any) {
            setError("Erreur lors de la récupération des statuts de chambre");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatuses();
    }, [fetchStatuses]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleOpenModal = (status?: RoomStatus) => {
        if (status) {
            setEditingStatus(status);
            setFormData({ libele: status.libele });
        } else {
            setEditingStatus(null);
            setFormData({ libele: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.libele.trim()) return;

        setIsSubmitting(true);
        setError(null);
        try {
            if (editingStatus?.idStatus) {
                await roomStatusService.update(editingStatus.idStatus, formData);
                setSuccess("Statut mis à jour avec succès");
            } else {
                await roomStatusService.create(formData as RoomStatus);
                setSuccess("Statut créé avec succès");
            }
            await fetchStatuses();
            setIsModalOpen(false);
        } catch (err: any) {
            setError("Erreur lors de l'enregistrement du statut");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteModal = (id: number) => {
        setStatusToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!statusToDelete) return;
        setIsDeleting(true);
        try {
            await roomStatusService.delete(statusToDelete);
            setSuccess("Statut supprimé avec succès");
            await fetchStatuses();
            setIsDeleteModalOpen(false);
            setStatusToDelete(null);
        } catch (err: any) {
            setError("Erreur lors de la suppression du statut");
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredStatuses = statuses.filter(s =>
        s.libele.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Settings className="w-8 h-8 text-green-600 dark:text-green-500" />
                        </div>
                        Paramètres du Système
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Gérez les configurations globales et les statuts des ressources
                    </p>
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{success}</p>
                </div>
            )}

            {/* Content Tabs/Sections */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            Statuts des Chambres
                        </h2>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg text-sm font-semibold"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter un statut
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un statut..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-slate-900 dark:text-white"
                        />
                    </div>

                    {/* Status Table */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/80">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Libellé</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-12 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-500" />
                                            <p className="mt-2 text-slate-500">Chargement...</p>
                                        </td>
                                    </tr>
                                ) : filteredStatuses.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-12 text-center text-slate-500 italic">
                                            Aucun statut trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStatuses.map((status) => (
                                        <tr key={status.idStatus} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {status.libele}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(status)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => status.idStatus && openDeleteModal(status.idStatus)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
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
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingStatus ? "Modifier le statut" : "Nouveau statut"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Libellé du statut <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.libele}
                                onChange={(e) => setFormData({ libele: e.target.value })}
                                placeholder="Ex: Disponible, En maintenance..."
                                required
                                autoFocus
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all font-medium"
                            />
                        </div>
                        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-6 py-3 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {editingStatus ? "Mettre à jour" : "Créer le statut"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-10 h-10 text-red-600 dark:text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Supprimer le statut ?</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">
                                Cette action supprimera définitivement le statut. Assurez-vous qu'aucune chambre ne l'utilise.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={isDeleting}
                                    className="flex-1 px-6 py-4 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-6 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Supprimer"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper icons
function X(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function Save(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
}
