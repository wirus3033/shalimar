import api from '../lib/api';

export interface Uniter {
    IDUniter?: number;
    libelle: string;
}

export const uniterService = {
    /**
     * Récupérer toutes les unités
     */
    getAll: async (): Promise<Uniter[]> => {
        return api.get('/uniters');
    },

    /**
     * Récupérer une unité par ID
     */
    getById: async (id: number): Promise<Uniter> => {
        return api.get(`/uniters/${id}`);
    },

    /**
     * Créer une nouvelle unité
     */
    create: async (uniter: Uniter): Promise<Uniter> => {
        return api.post('/uniters', uniter);
    },

    /**
     * Modifier une unité
     */
    update: async (id: number, uniter: Partial<Uniter>): Promise<Uniter> => {
        return api.put(`/uniters/${id}`, uniter);
    },

    /**
     * Supprimer une unité
     */
    delete: async (id: number): Promise<void> => {
        return api.delete(`/uniters/${id}`);
    },
};
