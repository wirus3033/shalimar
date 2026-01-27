import api from '../lib/api';

export interface UserData {
    IDutilisateur?: number;
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    IDprofil: number;
    mot_de_passe: string;
    image?: string | File;
}

export const userService = {
    createUser: async (userData: UserData) => {
        if (userData.image instanceof File) {
            const formData = new FormData();
            Object.entries(userData).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
            return api.post('/utilisateurs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
        return api.post('/utilisateurs', userData);
    },

    getProfiles: async () => {
        return api.get('/profils');
    },

    /**
     * Récupérer un utilisateur par son ID
     */
    getById: async (id: number): Promise<UserData> => {
        return api.get(`/utilisateurs/${id}`);
    },

    /**
     * Récupérer tous les utilisateurs
     */
    getAll: async (): Promise<UserData[]> => {
        return api.get('/utilisateurs');
    },

    /**
     * Mettre à jour un utilisateur
     */
    update: async (id: number, userData: Partial<UserData>): Promise<UserData> => {
        if (userData.image instanceof File) {
            const formData = new FormData();
            Object.entries(userData).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
            return api.put(`/utilisateurs/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
        return api.put(`/utilisateurs/${id}`, userData);
    },

    /**
     * Supprimer un utilisateur
     */
    delete: async (id: number): Promise<void> => {
        return api.delete(`/utilisateurs/${id}`);
    },
};
