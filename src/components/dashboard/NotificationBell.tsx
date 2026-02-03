'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { notificationService, Notification } from '@/services/notification.service';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function NotificationBell() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getAll();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error('Failed to load notifications', error);
        }
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n =>
                n.IDNotification === id ? { ...n, is_read: 1 } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await notificationService.delete(id);
            const updated = notifications.filter(n => n.IDNotification !== id);
            setNotifications(updated);
            setUnreadCount(updated.filter(n => !n.is_read).length);
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    return (
        <Popover>
            <PopoverTrigger>
                <button
                    className="relative p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900"></span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    <Link
                        href="/dashboard/notifications"
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                        Voir tout
                    </Link>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            Aucune notification
                        </div>
                    ) : (
                        notifications.slice(0, 5).map((notif) => (
                            <div
                                key={notif.IDNotification}
                                onClick={() => router.push(`/dashboard/notifications?id=${notif.IDNotification}`)}
                                className={`p-4 border-b border-gray-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <p className={`text-sm ${!notif.is_read ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {notif.message}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(notif.date_creation).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {!notif.is_read && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(notif.IDNotification, e)}
                                                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400"
                                                title="Marquer comme lu"
                                            >
                                                <Check className="w-3 h-3" />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => handleDelete(notif.IDNotification, e)}
                                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded-full text-slate-400 hover:text-red-500"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
