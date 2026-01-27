"use client";

import { CalendarCheck, Plus, Search, Filter, Eye, Pencil, Trash2, Printer, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { reservationService, Reservation } from "@/services/reservation.service";
import { formatDate } from "@/lib/utils";

export default function ReservationPage() {
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchReservations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await reservationService.getAll();
            setReservations(data);
        } catch (err) {
            console.error("Failed to fetch reservations:", err);
            setError("Erreur lors de la récupération des réservations.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleDelete = async () => {
        if (!reservationToDelete || !reservationToDelete.IDReservation) return;

        setIsDeleting(true);
        try {
            await reservationService.delete(reservationToDelete.IDReservation);
            setReservations(prev => prev.filter(r => r.IDReservation !== reservationToDelete.IDReservation));
            setReservationToDelete(null);
        } catch (err) {
            console.error("Failed to delete reservation:", err);
            alert("Erreur lors de la suppression de la réservation.");
        } finally {
            setIsDeleting(false);
        }
    };

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
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{reservations.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Arrivées aujourd'hui</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {reservations.filter(r => new Date(r.date_entree).toDateString() === new Date().toDateString()).length}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Départs aujourd'hui</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {reservations.filter(r => new Date(r.date_sortie).toDateString() === new Date().toDateString()).length}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Montant Total</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {reservations.reduce((sum, r) => sum + (parseFloat(String(r.montant_total)) || 0), 0).toLocaleString()} Ar
                    </p>
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
                                    Montant Total
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Reste à payer
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                                            <p className="text-slate-500 text-sm">Chargement des réservations...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3 text-red-500">
                                            <AlertCircle className="w-8 h-8" />
                                            <p className="font-semibold">{error}</p>
                                            <button
                                                onClick={() => fetchReservations()}
                                                className="mt-2 text-sm underline hover:text-red-600"
                                            >
                                                Réessayer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : reservations.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <p className="text-slate-500">Aucune réservation trouvée.</p>
                                    </td>
                                </tr>
                            ) : (
                                reservations.map((reservation) => (
                                    <tr
                                        key={reservation.IDReservation}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                            {reservation.nom_client}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {reservation.numero_Chambre || `Chambre ${reservation.IDChambre}`}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {formatDate(reservation.date_entree)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {formatDate(reservation.date_sortie)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                            {parseFloat(String(reservation.montant_total)).toLocaleString()} Ar
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-red-600 dark:text-red-400">
                                            {parseFloat(String(reservation.reste_a_payer)).toLocaleString()} Ar
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
                                                    onClick={() => router.push(`/dashboard/reservation/modifier/${reservation.IDReservation}`)}
                                                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                    title="Modifier"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setReservationToDelete(reservation)}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {reservationToDelete && (
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
                                Êtes-vous sûr de vouloir supprimer la réservation de <strong>{reservationToDelete.nom_client}</strong> ? Cette action est irréversible.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setReservationToDelete(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
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
