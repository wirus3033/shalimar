"use client";

import { useState, useEffect, useCallback } from "react";
import { BedDouble, Plus, Search, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { roomService, Room } from "@/services/room.service";
import { roomStatusService, RoomStatus } from "@/services/room-status.service";

export default function ChambrePage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [statuses, setStatuses] = useState<RoomStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Delete modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [roomsData, statusesData] = await Promise.all([
                roomService.getAll(),
                roomStatusService.getAll()
            ]);
            setRooms(roomsData);
            setStatuses(statusesData);
        } catch (err: any) {
            console.error("Failed to fetch rooms:", err);
            setError("Erreur lors de la récupération des chambres. Vérifiez que l'API est active.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getStatusInfo = (statusId: number) => {
        const status = statuses.find(s => s.idStatus === statusId);
        return status ? status.libele : "Inconnu";
    };

    // Helper to get room number from various possible property names
    const getRoomNumber = (room: any) => {
        const val = room.numero_Chambre ?? room.numero_chambre ?? room.numeroChambre ?? room.numero;
        // If we have a value and it's not empty, return it. If it's a number, convert to string.
        if (val !== undefined && val !== null && val !== "") return String(val);
        return `#${room.IDChambre}` || "---";
    };

    const getStatusColor = (statusName: string) => {
        const name = statusName.toLowerCase();
        // Check for "disponible" (must not have "in" before it)
        if (name.includes("disponible") && !name.includes("indisponible"))
            return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

        // Red for occupied, full, or unavailable (handling both accented and non-accented)
        if (name.includes("occup") || name.includes("plein") || name.includes("indispon"))
            return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

        if (name.includes("mainten") || name.includes("trav") || name.includes("propre") || name.includes("sal"))
            return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";

        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    };

    const handleDeleteClick = (id: number) => {
        setRoomToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!roomToDelete) return;
        setIsDeleting(true);
        try {
            await roomService.delete(roomToDelete);
            await fetchData();
            setIsDeleteModalOpen(false);
            setRoomToDelete(null);
        } catch (err: any) {
            setError("Erreur lors de la suppression de la chambre");
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredRooms = rooms.filter(room => {
        const roomNum = String(getRoomNumber(room)).toLowerCase();
        const status = getStatusInfo(room.IDstatusChambre).toLowerCase();
        const query = searchQuery.toLowerCase();
        return roomNum.includes(query) || status.includes(query);
    });

    console.log("Rooms from API:", rooms);

    const stats = {
        total: rooms.length,
        available: rooms.filter(r => {
            const label = getStatusInfo(r.IDstatusChambre).toLowerCase();
            return label.includes("disponible") && !label.includes("indisponible");
        }).length,
        occupied: rooms.filter(r => {
            const label = getStatusInfo(r.IDstatusChambre).toLowerCase();
            return label.includes("occup") || label.includes("indispon");
        }).length,
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestion des Chambres</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Consultez et gérez l'inventaire des chambres</p>
                </div>
                <Link href="/dashboard/chambre/nouveau">
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-bold">
                        <Plus className="w-5 h-5" />
                        Nouvelle Chambre
                    </button>
                </Link>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                    <button onClick={fetchData} className="ml-auto text-xs font-bold underline">Actualiser</button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <BedDouble className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Disponibles</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{isLoading ? "..." : stats.available}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                            <BedDouble className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Indisponible</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{isLoading ? "..." : stats.occupied}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <BedDouble className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{isLoading ? "..." : stats.total}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Rechercher par numéro ou par statut..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-900 dark:text-white shadow-sm font-medium"
                />
            </div>

            {/* Content Area */}
            <div className="flex items-center justify-between mt-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Liste des Chambres
                </h2>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
                    <p className="text-slate-500 font-medium">Chargement des chambres...</p>
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
                    <p className="text-slate-500 font-medium">Aucune chambre trouvée</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRooms.map((room) => {
                        const statusLabel = getStatusInfo(room.IDstatusChambre);
                        return (
                            <div
                                key={room.IDChambre}
                                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chambre</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                            {getRoomNumber(room)}
                                        </h3>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
                                            statusLabel
                                        )}`}
                                    >
                                        {statusLabel}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {room.tarif} <span className="text-sm font-medium">Ar</span>
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/dashboard/chambre/nouveau?id=${room.IDChambre}`}>
                                            <button
                                                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-all"
                                                title="Modifier"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => room.IDChambre && handleDeleteClick(room.IDChambre)}
                                            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-600 transition-all"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Custom Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-10 h-10 text-red-600 dark:text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Supprimer la chambre ?</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">
                                Êtes-vous sûr de vouloir supprimer la chambre #{roomToDelete} ? Cette action est irréversible.
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
