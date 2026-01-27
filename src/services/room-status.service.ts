import api from '../lib/api';

export interface RoomStatus {
    idStatus?: number;
    libele: string;
}

export const roomStatusService = {
    /**
     * Récupérer tous les statuts de chambre
     */
    getAll: async (): Promise<RoomStatus[]> => {
        return api.get('/status-chambres');
    },

    /**
     * Récupérer un statut par son ID
     */
    getById: async (id: number): Promise<RoomStatus> => {
        return api.get(`/status-chambres/${id}`);
    },

    /**
     * Créer un nouveau statut
     */
    create: async (status: RoomStatus): Promise<RoomStatus> => {
        return api.post('/status-chambres', status);
    },

    /**
     * Mettre à jour un statut
     */
    update: async (id: number, status: Partial<RoomStatus>): Promise<RoomStatus> => {
        return api.put(`/status-chambres/${id}`, status);
    },

    /**
     * Supprimer un statut
     */
    delete: async (id: number): Promise<void> => {
        return api.delete(`/status-chambres/${id}`);
    },
};
