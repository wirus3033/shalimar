import api from '../lib/api';
import { Uniter } from './uniter.service';

export interface Achat {
    IDAchat?: number;
    date_achat: string | Date;
    produit: string;
    quantite: number;
    PU: number;
    IDUniter: number;
    uniter?: Uniter;
    montant?: number;
    observation?: string;
}

export const achatService = {
    /**
     * Récupérer tous les achats
     */
    getAll: async (): Promise<Achat[]> => {
        return api.get('/achats');
    },

    /**
     * Récupérer un achat par ID
     */
    getById: async (id: number): Promise<Achat> => {
        return api.get(`/achats/${id}`);
    },

    /**
     * Créer un nouvel achat
     */
    create: async (achat: Achat): Promise<Achat> => {
        return api.post('/achats', achat);
    },

    /**
     * Modifier un achat
     */
    update: async (id: number, achat: Partial<Achat>): Promise<Achat> => {
        return api.put(`/achats/${id}`, achat);
    },

    /**
     * Supprimer un achat
     */
    delete: async (id: number): Promise<void> => {
        return api.delete(`/achats/${id}`);
    },
};
