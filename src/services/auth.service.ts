import api from '../lib/api';

export interface AuthResponse {
    token: string;
    utilisateur: {
        id: string;
        nom: string;
        prenom: string;
        email: string;
        profil: string;
    };
}

export const authService = {
    /**
     * Authentifier un utilisateur
     */
    login: async (login: string, motDePasse: string): Promise<AuthResponse> => {
        const response: AuthResponse = await api.post('/auth/login', { login, motDePasse });

        // Stocker le token dans le localStorage
        if (response.token && typeof window !== 'undefined') {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.utilisateur));
        }

        return response;
    },

    /**
     * Se déconnecter
     */
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    },

    /**
     * Récupérer l'utilisateur actuel (depuis le stockage local)
     */
    getCurrentUser: () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    }
};

export default authService;
