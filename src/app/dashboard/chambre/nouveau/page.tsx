"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, X } from "lucide-react";

export default function NouveauChambrePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        numero: "",
        type: "Simple",
        prix: "",
        disponibilite: "Disponible",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Nouvelle chambre:", formData);
        // Simuler l'enregistrement
        router.push("/dashboard/chambre");
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
                            Nouvelle Chambre
                        </h1>
                        <p className="mt-1">
                            Ajoutez une nouvelle chambre au système.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Numéro de chambre */}
                        <div>
                            <label>
                                Numéro de chambre
                            </label>
                            <input
                                type="text"
                                name="numero"
                                value={formData.numero}
                                onChange={handleInputChange}
                                placeholder="ex: 101"
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Type de chambre */}
                        <div>
                            <label>
                                Type de chambre
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                            >
                                <option value="Simple">Simple</option>
                                <option value="Double">Double</option>
                                <option value="Suite">Suite</option>
                            </select>
                        </div>

                        {/* Prix */}
                        <div>
                            <label>
                                Prix par nuit (€)
                            </label>
                            <input
                                type="number"
                                name="prix"
                                value={formData.prix}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Disponibilité */}
                        <div>
                            <label>
                                Disponibilité initiale
                            </label>
                            <select
                                name="disponibilite"
                                value={formData.disponibilite}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
                            >
                                <option value="Disponible">Disponible</option>
                                <option value="Maintenance">En Maintenance</option>
                                <option value="Occupée">Occupée</option>
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
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-bold flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Enregistrer la chambre
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
