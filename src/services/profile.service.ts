import api from '../lib/api';

export interface Profile {
    IDprofil?: number;
    libele: string;
}

export const profileService = {
    /**
     * Récupérer tous les profils
     */
    getAll: async (): Promise<Profile[]> => {
        return api.get('/profils');
    },

    /**
     * Récupérer un profil par son ID
     */
    getById: async (id: string): Promise<Profile> => {
        return api.get(`/profils/${id}`);
    },

    /**
     * Créer un nouveau profil
     */
    create: async (profileData: Profile): Promise<Profile> => {
        return api.post('/profils', profileData);
    },

    /**
     * Modifier un profil existant
     */
    update: async (id: string, profileData: Partial<Profile>): Promise<Profile> => {
        return api.put(`/profils/${id}`, profileData);
    },

    /**
     * Supprimer un profil
     */
    delete: async (id: string): Promise<void> => {
        return api.delete(`/profils/${id}`);
    },
};

export default profileService;
