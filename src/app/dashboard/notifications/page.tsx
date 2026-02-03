'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { notificationService, Notification } from '@/services/notification.service';
import { Trash2, Bell, CheckCircle, AlertTriangle, Info, XCircle, PlusCircle, Edit, FileText, Loader2, Check } from 'lucide-react';
import { reservationService } from '@/services/reservation.service';
import { roomService } from '@/services/room.service';
import { userService } from '@/services/user.service';

export default function NotificationsPage() {
    const searchParams = useSearchParams();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [entityName, setEntityName] = useState<string | null>(null);
    const [loadingEntity, setLoadingEntity] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    // Effect to handle selection from URL parameter
    useEffect(() => {
        const id = searchParams.get('id');
        if (id && notifications.length > 0 && !loading) {
            const notifId = parseInt(id);
            const notif = notifications.find(n => n.IDNotification === notifId);
            if (notif) {
                handleView(notif);
            }
        }
    }, [searchParams, notifications, loading]);

    useEffect(() => {
        const fetchEntityDetails = async () => {
            if (!selectedNotification?.entity_id || !selectedNotification?.entity_type) {
                setEntityName(null);
                return;
            }

            setLoadingEntity(true);
            try {
                const type = selectedNotification.entity_type.toLowerCase();
                const id = selectedNotification.entity_id;
                let name = null;

                if (type.includes('reservation')) {
                    const res = await reservationService.getById(id);
                    name = res.nom_client;
                } else if (type.includes('chambre') || type.includes('room')) {
                    const room = await roomService.getById(id);
                    name = `Chambre ${room.numero_Chambre}`;
                } else if (type.includes('user') || type.includes('utilisateur')) {
                    const user = await userService.getById(id);
                    name = `${user.prenom} ${user.nom}`;
                }

                setEntityName(name);
            } catch (error) {
                console.error('Failed to fetch entity details', error);
                setEntityName(null);
            } finally {
                setLoadingEntity(false);
            }
        };

        fetchEntityDetails();
    }, [selectedNotification]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getAll();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
            try {
                await notificationService.delete(id);
                setNotifications(notifications.filter(n => n.IDNotification !== id));
                if (selectedNotification?.IDNotification === id) {
                    setSelectedNotification(null);
                }
            } catch (error) {
                console.error('Failed to delete notification', error);
            }
        }
    };

    const handleView = async (notification: Notification) => {
        setSelectedNotification(notification);
        if (!notification.is_read) {
            try {
                await notificationService.markAsRead(notification.IDNotification);
                setNotifications(notifications.map(n =>
                    n.IDNotification === notification.IDNotification ? { ...n, is_read: 1 } : n
                ));
            } catch (error) {
                console.error('Failed to mark as read', error);
            }
        }
    };

    const getIcon = (type: string, sizeClass: string = "w-5 h-5") => {
        switch (type) {
            case 'CREATION': return <PlusCircle className={`${sizeClass} text-green-500`} />;
            case 'MODIFICATION': return <Edit className={`${sizeClass} text-blue-500`} />;
            case 'SUPPRESSION': return <Trash2 className={`${sizeClass} text-red-500`} />;
            case 'INFO': return <Info className={`${sizeClass} text-sky-500`} />;
            case 'WARNING': return <AlertTriangle className={`${sizeClass} text-amber-500`} />;
            default: return <Bell className={`${sizeClass} text-slate-500`} />;
        }
    };

    const getTypeStyle = (type: string) => {
        switch (type) {
            case 'CREATION': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            case 'MODIFICATION': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'SUPPRESSION': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            case 'WARNING': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'CREATION': return 'Création';
            case 'MODIFICATION': return 'Modification';
            case 'SUPPRESSION': return 'Suppression';
            default: return type;
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header section matching other pages */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl shadow-sm">
                            <Bell className="w-8 h-8 text-green-600 dark:text-green-500" />
                        </div>
                        Gestion des Notifications
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 ml-1">
                        Consultez et gérez les alertes et activités récentes du système
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{unreadCount}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">non lues</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Column */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-[calc(100vh-250px)] flex flex-col">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500" />
                            Historique
                        </h2>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300">
                            {notifications.length}
                        </span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-3 space-y-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                                <span className="text-sm font-medium">Chargement des notifications...</span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                                <Bell className="w-12 h-12 text-slate-200 dark:text-slate-800" />
                                <span className="text-sm">Aucune notification pour le moment</span>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.IDNotification}
                                    onClick={() => handleView(notif)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border group relative ${selectedNotification?.IDNotification === notif.IDNotification
                                        ? 'bg-blue-50/80 border-blue-200 shadow-md dark:bg-blue-900/20 dark:border-blue-800 z-10'
                                        : notif.is_read
                                            ? 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:border-slate-700'
                                            : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-green-200 hover:shadow-sm dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {!notif.is_read && (
                                        <div className="absolute right-3 top-3 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-slate-900"></div>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${getTypeStyle(notif.type)} bg-opacity-10`}>
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className={`text-sm font-bold truncate pr-4 ${notif.is_read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {getTypeLabel(notif.type)}
                                                </p>
                                            </div>
                                            <p className={`text-xs truncate mt-1 ${notif.is_read ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
                                                {new Date(notif.date_creation).toLocaleDateString()} • {new Date(notif.date_creation).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-2">
                    {selectedNotification ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Card Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/30 dark:bg-slate-800/20">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${getTypeStyle(selectedNotification.type)} bg-opacity-20`}>
                                        {getIcon(selectedNotification.type, "w-6 h-6")}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{getTypeLabel(selectedNotification.type)}</h2>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                            <span>Reçue le {new Date(selectedNotification.date_creation).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                            <span>{new Date(selectedNotification.date_creation).toLocaleTimeString()}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(selectedNotification.IDNotification);
                                        }}
                                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all group border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                                        title="Supprimer définitivement"
                                    >
                                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8 flex-1 overflow-y-auto">
                                <div className="prose max-w-none dark:prose-invert">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Message</h3>
                                    <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        {selectedNotification.message}
                                    </p>

                                    {selectedNotification.entity_id && (
                                        <div className="mt-8">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                Contexte technique
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Type d'entité</p>
                                                    <p className="text-slate-900 dark:text-white font-mono text-sm">{selectedNotification.entity_type}</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Entité concernée</p>
                                                    {loadingEntity ? (
                                                        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                                                    ) : (
                                                        <div className="flex flex-col">
                                                            <p className="text-slate-900 dark:text-white font-bold text-sm">
                                                                {entityName || `ID #${selectedNotification.entity_id}`}
                                                            </p>
                                                            {/* {entityName && (
                                                                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                                                                    ID #{selectedNotification.entity_id}
                                                                </p>
                                                            )} */}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Notification lue et archivée
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col items-center justify-center text-center p-12 animate-in fade-in duration-500">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Aucune sélection</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
                                Sélectionnez une notification dans la liste de gauche pour afficher les détails complets.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
