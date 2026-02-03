'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Plus, Search, Filter, Pencil, Trash2, Printer, Loader2, AlertCircle, X, Save, Eye } from 'lucide-react';
import { achatService, Achat } from '@/services/achat.service';
import { uniterService, Uniter } from '@/services/uniter.service';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDate, toInputDate } from '@/lib/utils';

export default function AchatPage() {
    const [achats, setAchats] = useState<Achat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Units state
    const [uniters, setUniters] = useState<Uniter[]>([]);
    const [isLoadingUnits, setIsLoadingUnits] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAchat, setCurrentAchat] = useState<Partial<Achat>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Delete state
    const [achatToDelete, setAchatToDelete] = useState<Achat | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // View state
    const [achatToView, setAchatToView] = useState<Achat | null>(null);

    const fetchAchats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await achatService.getAll();
            setAchats(data);
        } catch (err) {
            console.error("Failed to fetch achats:", err);
            setError("Erreur lors de la récupération des achats.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUniters = useCallback(async () => {
        setIsLoadingUnits(true);
        try {
            const data = await uniterService.getAll();
            setUniters(data);
        } catch (err) {
            console.error("Failed to fetch units:", err);
        } finally {
            setIsLoadingUnits(false);
        }
    }, []);

    useEffect(() => {
        fetchAchats();
        fetchUniters();
    }, [fetchAchats, fetchUniters]);

    const handleOpenModal = (achat?: Achat) => {
        if (achat) {
            setIsEditing(true);
            setCurrentAchat({ ...achat, date_achat: toInputDate(achat.date_achat) });
        } else {
            setIsEditing(false);
            setCurrentAchat({
                date_achat: new Date().toISOString().split('T')[0],
                produit: '',
                quantite: 1,
                PU: 0,
                IDUniter: uniters.length > 0 ? uniters[0].IDUniter : undefined,
                observation: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentAchat({});
        setIsEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isEditing && currentAchat.IDAchat) {
                await achatService.update(currentAchat.IDAchat, currentAchat);
            } else {
                await achatService.create(currentAchat as Achat);
            }
            fetchAchats();
            handleCloseModal();
        } catch (err) {
            console.error("Failed to save achat:", err);
            alert("Erreur lors de l'enregistrement de l'achat.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!achatToDelete || !achatToDelete.IDAchat) return;

        setIsDeleting(true);
        try {
            await achatService.delete(achatToDelete.IDAchat);
            setAchats(prev => prev.filter(a => a.IDAchat !== achatToDelete.IDAchat));
            setAchatToDelete(null);
        } catch (err) {
            console.error("Failed to delete achat:", err);
            alert("Erreur lors de la suppression de l'achat.");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredAchats = achats.filter(achat =>
        achat.produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (achat.observation && achat.observation.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl shadow-sm">
                            <ShoppingCart className="w-8 h-8 text-green-600 dark:text-green-500" />
                        </div>
                        Gestion des Achats
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 ml-1">
                        Suivez et contrôlez vos commandes et acquisitions
                    </p>
                </div> */}
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nouvel Achat</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un produit, observation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white transition-all shadow-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                    <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Filtrer</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Achats</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{achats.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Dépense du mois</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                        {achats
                            .filter(a => new Date(a.date_achat).getMonth() === new Date().getMonth())
                            .reduce((sum, a) => sum + (parseFloat(String(a.montant)) || 0), 0)
                            .toLocaleString()} Ar
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Produit</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantité</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unité</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prix Unitaire</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Montant</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                                            <p className="text-slate-500 text-sm font-medium">Chargement des données...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3 text-red-500">
                                            <AlertCircle className="w-8 h-8" />
                                            <p className="font-semibold">{error}</p>
                                            <button onClick={fetchAchats} className="mt-2 text-sm underline hover:text-red-600">
                                                Réessayer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAchats.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                                            <p className="font-medium">Aucun achat trouvé</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAchats.map((achat) => (
                                    <tr key={achat.IDAchat} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                            {formatDate(achat.date_achat)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                            {achat.produit}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center text-slate-600 dark:text-slate-300">
                                            <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md font-medium">
                                                {achat.quantite}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                            {achat.uniter?.libelle || uniters.find(u => u.IDUniter === achat.IDUniter)?.libelle || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-slate-600 dark:text-slate-300 font-mono">
                                            {parseFloat(String(achat.PU)).toLocaleString()} Ar
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-green-600 dark:text-green-400 font-mono">
                                            {parseFloat(String(achat.montant)).toLocaleString()} Ar
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setAchatToView(achat)}
                                                    className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                                                    title="Voir détails"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(achat)}
                                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                    title="Modifier"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setAchatToDelete(achat)}
                                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {isEditing ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-green-500" />}
                                {isEditing ? "Modifier l'achat" : "Nouveau Achat"}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date d'achat</label>
                                    <input
                                        type="date"
                                        required
                                        value={String(currentAchat.date_achat)}
                                        onChange={(e) => setCurrentAchat({ ...currentAchat, date_achat: e.target.value })}
                                        className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Produit</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nom du produit"
                                        value={currentAchat.produit || ''}
                                        onChange={(e) => setCurrentAchat({ ...currentAchat, produit: e.target.value })}
                                        className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantité</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={currentAchat.quantite || ''}
                                            onChange={(e) => setCurrentAchat({ ...currentAchat, quantite: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prix Unitaire (Ar)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={currentAchat.PU || ''}
                                            onChange={(e) => setCurrentAchat({ ...currentAchat, PU: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unité de mesure</label>
                                    <select
                                        required
                                        value={currentAchat.IDUniter || ''}
                                        onChange={(e) => setCurrentAchat({ ...currentAchat, IDUniter: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="" disabled>Sélectionnez une unité</option>
                                        {uniters.map((unit) => (
                                            <option key={unit.IDUniter} value={unit.IDUniter}>
                                                {unit.libelle}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Observation</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Notes ou détails supplémentaires..."
                                        value={currentAchat.observation || ''}
                                        onChange={(e) => setCurrentAchat({ ...currentAchat, observation: e.target.value })}
                                        className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {achatToView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Eye className="w-5 h-5 text-green-500" />
                                Détails de l'achat
                            </h2>
                            <button onClick={() => setAchatToView(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Date</p>
                                    <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                                        {formatDate(achatToView.date_achat)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Produit</p>
                                    <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                                        {achatToView.produit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Quantité</p>
                                    <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                                        {achatToView.quantite}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Prix Unitaire</p>
                                    <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                                        {parseFloat(String(achatToView.PU)).toLocaleString()} Ar
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Unité</p>
                                    <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">
                                        {achatToView.uniter?.libelle || uniters.find(u => u.IDUniter === achatToView.IDUniter)?.libelle || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Montant Total</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                                    {parseFloat(String(achatToView.montant)).toLocaleString()} Ar
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Observation</p>
                                <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 min-h-[80px]">
                                    {achatToView.observation || "Aucune observation"}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
                            <button
                                onClick={() => setAchatToView(null)}
                                className="px-6 py-2 text-sm font-bold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 rounded-xl transition-colors shadow-lg shadow-slate-900/20"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {achatToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 text-red-600 mb-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Confirmer la suppression</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">
                                Êtes-vous sûr de vouloir supprimer l'achat de <strong>{achatToDelete.produit}</strong> ? Cette action est irréversible.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setAchatToDelete(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-6 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                {isDeleting ? "Suppression..." : "Supprimer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
