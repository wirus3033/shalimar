"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Save, X, Loader2, AlertCircle } from "lucide-react";
import { roomService, Room } from "@/services/room.service";
import { roomStatusService, RoomStatus } from "@/services/room-status.service";

function RoomForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomId = searchParams.get("id");
    const isEditing = !!roomId;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingStatuses, setIsFetchingStatuses] = useState(true);
    const [isFetchingRoom, setIsFetchingRoom] = useState(false);
    const [statuses, setStatuses] = useState<RoomStatus[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Room>({
        numero_Chambre: "",
        tarif: 0,
        IDstatusChambre: 0,
    });

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const data = await roomStatusService.getAll();
                setStatuses(data);
                if (data.length > 0 && !isEditing) {
                    setFormData(prev => ({ ...prev, IDstatusChambre: data[0].idStatus || 0 }));
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des statuts:", err);
                setError("Impossible de charger les statuts de chambre");
            } finally {
                setIsFetchingStatuses(false);
            }
        };
        fetchStatuses();
    }, [isEditing]);

    useEffect(() => {
        if (isEditing && roomId) {
            const fetchRoom = async () => {
                setIsFetchingRoom(true);
                try {
                    const room = await roomService.getById(Number(roomId));
                    setFormData({
                        numero_Chambre: room.numero_Chambre || "",
                        tarif: room.tarif,
                        IDstatusChambre: room.IDstatusChambre,
                        IDChambre: room.IDChambre
                    });
                } catch (err) {
                    console.error("Erreur lors de la récupération de la chambre:", err);
                    setError("Impossible de charger les données de la chambre");
                } finally {
                    setIsFetchingRoom(false);
                }
            };
            fetchRoom();
        }
    }, [isEditing, roomId]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "tarif" || name === "IDstatusChambre" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.IDstatusChambre) {
            setError("Veuillez sélectionner un statut");
            return;
        }

        setIsLoading(true);
        try {
            if (isEditing && roomId) {
                await roomService.update(Number(roomId), formData);
            } else {
                await roomService.create(formData);
            }
            router.push("/dashboard/chambre");
            router.refresh();
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement de la chambre");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingRoom) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-green-500 mb-4" />
                <p className="text-slate-500">Chargement des données...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {isEditing ? "Modifier la Chambre" : "Nouvelle Chambre"}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {isEditing ? "Mettez à jour les informations de la chambre." : "Ajoutez une nouvelle chambre au système."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Numéro de chambre */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Numéro de chambre
                            </label>
                            <input
                                type="text"
                                name="numero_Chambre"
                                value={formData.numero_Chambre}
                                onChange={handleInputChange}
                                placeholder="ex: 101"
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white transition-all shadow-sm"
                            />
                        </div>

                        {/* Prix */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Prix par nuit (Ar)
                            </label>
                            <input
                                type="number"
                                name="tarif"
                                value={formData.tarif}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white transition-all shadow-sm"
                            />
                        </div>

                        {/* Statut (IDstatusChambre) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Statut de la chambre
                            </label>
                            <select
                                name="IDstatusChambre"
                                value={formData.IDstatusChambre || ""}
                                onChange={handleInputChange}
                                required
                                disabled={isFetchingStatuses}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                            >
                                <option value="" disabled> Sélectionner un statut...</option>
                                {statuses.map((status) => (
                                    <option key={status.idStatus} value={status.idStatus}>
                                        {status.libele}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-bold flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isEditing ? "Mettre à jour" : "Enregistrer la chambre"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function NouveauChambrePage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-green-500 mb-4" />
                <p className="text-slate-500">Chargement...</p>
            </div>
        }>
            <RoomForm />
        </Suspense>
    );
}
