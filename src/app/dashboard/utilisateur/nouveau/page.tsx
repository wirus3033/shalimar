"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ChevronLeft,
    Upload,
    User as UserIcon,
    Eye,
    EyeOff,
    Save,
    X,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { userService, UserData } from "@/services/user.service";
import { profileService, Profile } from "@/services/profile.service";

function UserForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("id");
    const isEditing = !!userId;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingProfiles, setIsFetchingProfiles] = useState(true);
    const [isFetchingUser, setIsFetchingUser] = useState(false);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<UserData>({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        IDprofil: 0,
        mot_de_passe: "",
        image: undefined
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const data = await profileService.getAll();
                setProfiles(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des profils:", err);
                setError("Impossible de charger la liste des profils");
            } finally {
                setIsFetchingProfiles(false);
            }
        };
        fetchProfiles();
    }, []);

    useEffect(() => {
        if (isEditing && userId) {
            const fetchUser = async () => {
                setIsFetchingUser(true);
                try {
                    const user = await userService.getById(Number(userId));
                    setFormData({
                        prenom: user.prenom || "",
                        nom: user.nom || "",
                        email: user.email || "",
                        telephone: user.telephone || "",
                        IDprofil: user.IDprofil || 0,
                        mot_de_passe: "", // Don't show hashed password
                        image: user.image
                    });
                    if (typeof user.image === "string") {
                        setImagePreview(user.image);
                    }
                    // For editing, confirm password is not strictly required if not changing it,
                    // but since our form requires it, we'll leave it empty for now or disable it.
                } catch (err) {
                    console.error("Erreur lors de la récupération de l'utilisateur:", err);
                    setError("Impossible de charger les données de l'utilisateur");
                } finally {
                    setIsFetchingUser(false);
                }
            };
            fetchUser();
        }
    }, [isEditing, userId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: undefined });
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Required password check only for new users
        if (!isEditing && formData.mot_de_passe !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        if (!formData.IDprofil) {
            setError("Veuillez sélectionner un profil");
            return;
        }

        setIsLoading(true);
        try {
            const payload: any = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                telephone: formData.telephone,
                IDprofil: formData.IDprofil,
            };

            // Only send password if provided
            if (formData.mot_de_passe) {
                payload.mot_de_passe = formData.mot_de_passe;
            }

            if (formData.image instanceof File) {
                payload.image = formData.image;
            }

            if (isEditing) {
                await userService.update(Number(userId), payload);
            } else {
                if (!formData.mot_de_passe) {
                    setError("Le mot de passe est requis");
                    setIsLoading(false);
                    return;
                }
                await userService.createUser(payload);
            }
            router.push("/dashboard/utilisateur");
            router.refresh();
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement de l'utilisateur");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
                <p className="text-slate-500">Chargement des données...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-600 dark:text-slate-400"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isEditing ? "Modification de l'utilisateur" : "Ajouter un utilisateur"}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isEditing ? `Modification des informations de ${formData.prenom} ${formData.nom}` : "Remplissez les informations pour créer un nouveau compte"}
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-10">
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                        Information personnelles
                    </h2>

                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="relative group">
                                <div className="w-36 h-36 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 overflow-hidden shadow-inner flex-shrink-0">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-16 h-16 text-slate-400" />
                                    )}
                                </div>

                                {imagePreview ? (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <label className="absolute bottom-2 right-2 p-2.5 bg-white dark:bg-slate-700 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-green-600 transition-all cursor-pointer">
                                        <Upload className="w-4 h-4" />
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                )}
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Code Utilisateur
                                </label>
                                <div className="w-64 px-4 py-3 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-mono">
                                    {isEditing && userId ? `USR-${userId.padStart(4, '0')}` : "Auto-généré"}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Prénom <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.prenom}
                                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                    required
                                    className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-900 dark:text-white shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Nom <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    required
                                    className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-900 dark:text-white shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-900 dark:text-white shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Téléphone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                    required
                                    className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-900 dark:text-white shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Profil <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.IDprofil || ""}
                                        onChange={(e) => setFormData({ ...formData, IDprofil: Number(e.target.value) })}
                                        required
                                        disabled={isFetchingProfiles}
                                        className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-900 dark:text-white appearance-none cursor-pointer shadow-sm disabled:opacity-50"
                                    >
                                        <option value="">
                                            {isFetchingProfiles ? "Chargement..." : "Sélectionner un profil..."}
                                        </option>
                                        {profiles.map((p) => (
                                            <option key={p.IDprofil} value={p.IDprofil}>
                                                {p.libele}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronLeft className="w-5 h-5 -rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {isEditing ? "Changer le mot de passe" : "Mot de passe"} {!isEditing && <span className="text-red-500">*</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.mot_de_passe}
                                        onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
                                        required={!isEditing}
                                        placeholder={isEditing ? "Laisser vide pour ne pas modifier" : "..."}
                                        className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-900 dark:text-white pr-12 shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {!isEditing && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Confirmation mot de passe <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required={!isEditing}
                                            className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-slate-900 dark:text-white pr-12 shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-3.5 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-10 py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isEditing ? "Mettre à jour" : "Enregistrer"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function NouveauUtilisateurPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
                <p className="text-slate-500">Chargement...</p>
            </div>
        }>
            <UserForm />
        </Suspense>
    );
}
