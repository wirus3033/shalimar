import api from '../lib/api';

export interface Reservation {
    IDReservation?: number;
    date_dossier: string;
    nom_client: string;
    date_entree: string;
    date_sortie: string;
    IDChambre: number;
    PUChambre: number;
    duree: number;
    montant_total: number;
    montant_paye?: number;
    reste_a_payer?: number;
    informations_complementaires?: string;
    // Added fields from JOIN if present
    numero_Chambre?: string;
}

export const reservationService = {
    /**
     * Récupérer toutes les réservations
     */
    getAll: async (): Promise<Reservation[]> => {
        return api.get('/reservations');
    },

    /**
     * Récupérer une réservation par son ID
     */
    getById: async (id: number): Promise<Reservation> => {
        return api.get(`/reservations/${id}`);
    },

    /**
     * Créer une nouvelle réservation
     */
    create: async (reservation: Reservation): Promise<any> => {
        return api.post('/reservations', reservation);
    },

    /**
     * Mettre à jour une réservation
     */
    update: async (id: number, reservation: Partial<Reservation>): Promise<any> => {
        return api.put(`/reservations/${id}`, reservation);
    },

    /**
     * Supprimer une réservation
     */
    delete: async (id: number): Promise<any> => {
        return api.delete(`/reservations/${id}`);
    },
};
