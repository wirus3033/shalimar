import api from '../lib/api';

export interface Notification {
    IDNotification: number;
    type: string; // "CREATION", "MODIFICATION", "SUPPRESSION", etc.
    message: string;
    date_creation: string;
    is_read: number; // 0 = non lu, 1 = lu
    entity_type?: string;
    entity_id?: number;
}

export const notificationService = {
    /**
     * Récupérer toutes les notifications
     */
    getAll: async (): Promise<Notification[]> => {
        return api.get('/notifications');
    },

    /**
     * Marquer une notification comme lue
     */
    markAsRead: async (id: number): Promise<any> => {
        return api.put(`/notifications/${id}/read`);
    },

    /**
     * Supprimer une notification
     */
    delete: async (id: number): Promise<any> => {
        return api.delete(`/notifications/${id}`);
    },
};
