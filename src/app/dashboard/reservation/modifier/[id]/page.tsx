"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, X, Loader2, AlertCircle } from "lucide-react";
import { roomService, Room } from "@/services/room.service";
import { roomStatusService, RoomStatus } from "@/services/room-status.service";
import { reservationService, Reservation } from "@/services/reservation.service";
import { toInputDate } from "@/lib/utils";

interface ModifierReservationPageProps {
    params: Promise<{ id: string }>;
}

export default function ModifierReservationPage({ params }: ModifierReservationPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [statuses, setStatuses] = useState<RoomStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);
    const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: "",
        client: "",
        dateEntree: "",
        dateSortie: "",
        chambre: "",
        pu: "",
        duree: "0",
        montant: "",
        paye: "",
        resteAPayer: "",
        infos: "",
    });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [roomsData, statusesData, reservationData] = await Promise.all([
                roomService.getAll(),
                roomStatusService.getAll(),
                reservationService.getById(parseInt(id))
            ]);

            setRooms(roomsData);
            setStatuses(statusesData);

            if (reservationData) {
                setFormData({
                    date: toInputDate(reservationData.date_dossier),
                    client: reservationData.nom_client,
                    dateEntree: toInputDate(reservationData.date_entree),
                    dateSortie: toInputDate(reservationData.date_sortie),
                    chambre: reservationData.IDChambre.toString(),
                    pu: reservationData.PUChambre.toString(),
                    duree: reservationData.duree.toString(),
                    montant: reservationData.montant_total.toString(),
                    paye: reservationData.montant_paye?.toString() || "0",
                    resteAPayer: reservationData.reste_a_payer?.toString() || "0",
                    infos: reservationData.informations_complementaires || "",
                });
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Erreur lors de la récupération des données.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            if (name === "chambre") {
                const selectedRoom = rooms.find(r => r.IDChambre?.toString() === value);
                if (selectedRoom) {
                    updated.pu = selectedRoom.tarif.toString();
                }
            }

            if (name === "pu" || name === "dateEntree" || name === "dateSortie" || name === "chambre" || name === "duree") {
                const pu = parseFloat(updated.pu) || 0;
                let nights = 0;

                if (name === "dateEntree" || name === "dateSortie") {
                    setDateError(null);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const entree = new Date(updated.dateEntree);
                    entree.setHours(0, 0, 0, 0);

                    const sortie = new Date(updated.dateSortie);
                    sortie.setHours(0, 0, 0, 0);

                    if (updated.dateEntree && updated.dateSortie && sortie <= entree) {
                        setDateError("La date de sortie doit être supérieure à la date d'entrée");
                    }

                    if (updated.dateEntree && updated.dateSortie) {
                        nights = Math.ceil(
                            (sortie.getTime() - entree.getTime()) / (1000 * 60 * 60 * 24)
                        );
                    }
                    updated.duree = nights > 0 ? nights.toString() : "0";
                }

                const duree = parseInt(updated.duree) || 0;

                if (duree > 0 && pu > 0 && !dateError) {
                    updated.montant = (pu * duree).toString();
                    const paye = parseFloat(updated.paye) || 0;
                    updated.resteAPayer = (parseFloat(updated.montant) - paye).toString();
                } else {
                    updated.montant = "";
                    updated.resteAPayer = "";
                }
            }

            if (name === "paye") {
                const montant = parseFloat(updated.montant) || 0;
                const paye = parseFloat(value) || 0;
                updated.resteAPayer = (montant - paye).toString();
            }

            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (dateError || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const reservationData: Reservation = {
                date_dossier: formData.date,
                nom_client: formData.client,
                date_entree: formData.dateEntree,
                date_sortie: formData.dateSortie,
                IDChambre: parseInt(formData.chambre),
                PUChambre: parseFloat(formData.pu),
                duree: parseInt(formData.duree),
                montant_total: parseFloat(formData.montant),
                montant_paye: parseFloat(formData.paye) || 0,
                informations_complementaires: formData.infos
            };

            await reservationService.update(parseInt(id), reservationData);
            router.push("/dashboard/reservation");
        } catch (err: any) {
            console.error("Failed to update reservation:", err);
            setError(err.response?.data?.message || "Erreur lors de la modification de la réservation. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoomSelect = (room: Room) => {
        setFormData(prev => {
            const updated = { ...prev, chambre: room.IDChambre?.toString() || "", pu: room.tarif.toString() };
            const duree = parseInt(updated.duree) || 0;
            if (duree > 0 && !dateError) {
                updated.montant = (room.tarif * duree).toString();
                const paye = parseFloat(updated.paye) || 0;
                updated.resteAPayer = (parseFloat(updated.montant) - paye).toString();
            } else {
                updated.montant = "";
                updated.resteAPayer = "";
            }
            return updated;
        });
        setIsRoomDropdownOpen(false);
    };

    const selectedRoom = rooms.find(r => r.IDChambre?.toString() === formData.chambre);

    const availableRooms = rooms.filter(r => {
        const status = statuses.find(s => s.idStatus === r.IDstatusChambre);
        const label = status?.libele.toLowerCase() || "";
        // In modification mode, the current room should also be listed if it's the one selected
        if (r.IDChambre?.toString() === formData.chambre) return true;
        return label.includes("disponible") && !label.includes("indisponible");
    });

    if (isLoading && !formData.client) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6" onClick={() => setIsRoomDropdownOpen(false)}>
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
                        <h1>
                            Modification de la Réservation
                        </h1>
                        <p className="mt-1">
                            Modifiez les informations de la réservation pour {formData.client}.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold animate-in shake-in duration-300">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Date du dossier
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                                className="w-full h-12 px-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-green-500/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 text-slate-900 dark:text-white transition-all shadow-sm"
                            />
                        </div>

                        {/* Client */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Client
                            </label>
                            <input
                                type="text"
                                name="client"
                                value={formData.client}
                                onChange={handleInputChange}
                                placeholder="Nom du client"
                                required
                                className="w-full h-12 px-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-green-500/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all shadow-sm"
                            />
                        </div>

                        {/* Date entrée */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Date d'entrée
                            </label>
                            <input
                                type="date"
                                name="dateEntree"
                                value={formData.dateEntree}
                                onChange={handleInputChange}
                                required
                                className={`w-full h-12 px-4 bg-white dark:bg-slate-900 border-2 ${dateError && (dateError.includes("entrée") || dateError.includes("passé")) ? "border-red-500 shadow-red-100" : "border-slate-200 dark:border-slate-800 hover:border-green-500/50"} rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 text-slate-900 dark:text-white transition-all shadow-sm`}
                            />
                        </div>

                        {/* Date sortie */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Date de Sortie
                            </label>
                            <input
                                type="date"
                                name="dateSortie"
                                value={formData.dateSortie}
                                onChange={handleInputChange}
                                min={formData.dateEntree}
                                required
                                className={`w-full h-12 px-4 bg-white dark:bg-slate-900 border-2 ${dateError && dateError.includes("sortie") ? "border-red-500 shadow-red-100" : "border-slate-200 dark:border-slate-800 hover:border-green-500/50"} rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 text-slate-900 dark:text-white transition-all shadow-sm`}
                            />
                        </div>
                    </div>

                    {dateError && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold animate-in shake-in duration-300">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {dateError}
                        </div>
                    )}
                    {/* Chambre */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Chambre
                            </label>
                            <div
                                onClick={() => !isLoading && setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                                className={`w-full h-12 px-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer flex justify-between items-center transition-all shadow-sm ${isLoading ? "opacity-50" : "hover:border-green-500/50"}`}
                            >
                                <span className={selectedRoom ? "text-slate-900 dark:text-white" : "text-slate-400"}>
                                    {isLoading ? "Chargement..." : selectedRoom ? `Chambre ${selectedRoom.numero_Chambre}` : "Sélectionner une chambre"}
                                </span>
                                <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${isRoomDropdownOpen ? "rotate-90" : "-rotate-90"}`} />
                            </div>

                            {/* Dropdown Menu */}
                            {isRoomDropdownOpen && (
                                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
                                    {availableRooms.length === 0 ? (
                                        <div className="px-4 py-3 text-sm text-slate-500 italic">Aucune chambre disponible</div>
                                    ) : (
                                        availableRooms.map(room => (
                                            <div
                                                key={room.IDChambre}
                                                onClick={() => handleRoomSelect(room)}
                                                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center group transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                                        Chambre {room.numero_Chambre}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-400 group-hover:text-green-500 transition-colors">
                                                    {room.tarif} Ar
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* PU */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                PU (Prix Unitaire)
                            </label>
                            <input
                                type="number"
                                name="pu"
                                value={formData.pu}
                                readOnly
                                placeholder="0.00"
                                required
                                min="0"
                                step="0.01"
                                className="w-full h-12 px-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-semibold text-slate-900 dark:text-white cursor-not-allowed"
                            />
                        </div>

                        {/* Durée */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Durée (Jours/Nuit)
                            </label>
                            <input
                                type="number"
                                name="duree"
                                value={formData.duree}
                                readOnly
                                className="w-full h-12 px-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-semibold text-slate-900 dark:text-white cursor-not-allowed"
                            />
                        </div>

                        {/* Montant */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Montant total
                            </label>
                            <input
                                type="number"
                                name="montant"
                                value={formData.montant}
                                readOnly
                                placeholder="0.00"
                                className="w-full h-12 px-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-semibold text-slate-900 dark:text-white cursor-not-allowed"
                            />
                        </div>

                        {/* Payé */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Montant payé
                            </label>
                            <input
                                type="number"
                                name="paye"
                                value={formData.paye}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full h-12 px-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-green-500/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 text-slate-900 dark:text-white transition-all shadow-sm"
                            />
                        </div>

                        {/* Reste à payer */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Reste à payer
                            </label>
                            <input
                                type="number"
                                name="resteAPayer"
                                value={formData.resteAPayer}
                                readOnly
                                placeholder="0.00"
                                className="w-full h-12 px-4 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-semibold text-slate-900 dark:text-white cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Infos */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Informations complémentaires
                        </label>
                        <textarea
                            name="infos"
                            value={formData.infos}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Notes, demandes spéciales..."
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-green-500/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none transition-all shadow-sm"
                        />
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
                            disabled={!!dateError || isLoading || isSubmitting}
                            className={`px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-bold flex items-center gap-2 ${!!dateError || isLoading || isSubmitting ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {isSubmitting ? "Mise à jour..." : "Mettre à jour la réservation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
