import api from '../lib/api';

export interface Room {
    IDChambre?: number;
    numero_Chambre: string;
    tarif: number;
    IDstatusChambre: number;
}

export const roomService = {
    /**
     * Récupérer toutes les chambres
     */
    getAll: async (): Promise<Room[]> => {
        return api.get('/chambres');
    },

    /**
     * Récupérer une chambre par son ID
     */
    getById: async (id: number): Promise<Room> => {
        return api.get(`/chambres/${id}`);
    },

    /**
     * Créer une nouvelle chambre
     */
    create: async (room: Room): Promise<Room> => {
        return api.post('/chambres', room);
    },

    /**
     * Mettre à jour une chambre
     */
    update: async (id: number, room: Partial<Room>): Promise<Room> => {
        return api.put(`/chambres/${id}`, room);
    },

    /**
     * Supprimer une chambre
     */
    delete: async (id: number): Promise<void> => {
        return api.delete(`/chambres/${id}`);
    },
};
