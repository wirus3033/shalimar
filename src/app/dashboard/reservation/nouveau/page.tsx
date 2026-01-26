"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, X } from "lucide-react";

export default function NouveauReservationPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        client: "",
        dateEntree: "",
        dateSortie: "",
        chambre: "",
        pu: "",
        montant: "",
        paye: "",
        resteAPayer: "",
        infos: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };

            // Auto-calculate montant and reste à payer
            if (name === "pu" || name === "dateEntree" || name === "dateSortie") {
                const pu = parseFloat(name === "pu" ? value : updated.pu) || 0;
                const entree = new Date(
                    name === "dateEntree" ? value : updated.dateEntree
                );
                const sortie = new Date(
                    name === "dateSortie" ? value : updated.dateSortie
                );
                const nights = Math.ceil(
                    (sortie.getTime() - entree.getTime()) / (1000 * 60 * 60 * 24)
                );
                if (nights > 0) {
                    updated.montant = (pu * nights).toString();
                    const paye = parseFloat(updated.paye) || 0;
                    updated.resteAPayer = (parseFloat(updated.montant) - paye).toString();
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Nouvelle réservation:", formData);
        // Simuler l'enregistrement
        router.push("/dashboard/reservation");
    };

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
                        <h1>
                            Nouvelle Réservation
                        </h1>
                        <p className="mt-1">
                            Remplissez les informations pour créer une nouvelle réservation.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
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
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>

                        {/* Date entrée */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Date d'entrée
                            </label>
                            <input
                                type="date"
                                name="dateEntree"
                                value={formData.dateEntree}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Date sortie */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Date de Sortie
                            </label>
                            <input
                                type="date"
                                name="dateSortie"
                                value={formData.dateSortie}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Chambre */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Chambre
                            </label>
                            <select
                                name="chambre"
                                value={formData.chambre}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                            >
                                <option value="">Sélectionner une chambre</option>
                                <option value="101">Chambre 101 - Simple</option>
                                <option value="102">Chambre 102 - Double</option>
                                <option value="103">Chambre 103 - Suite</option>
                                <option value="201">Chambre 201 - Simple</option>
                                <option value="202">Chambre 202 - Double</option>
                                <option value="203">Chambre 203 - Suite</option>
                            </select>
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
                                onChange={handleInputChange}
                                placeholder="0.00"
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
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
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold cursor-not-allowed"
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
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
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
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Infos */}
                    <div>
                        <label>
                            Informations complémentaires
                        </label>
                        <textarea
                            name="infos"
                            value={formData.infos}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Notes, demandes spéciales..."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white resize-none"
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
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-bold flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Enregistrer la réservation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
