'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

export default function DepensePage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-sm">
                            <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                        </div>
                        Gestion des Dépenses
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 ml-1">
                        Suivez et contrôlez vos dépenses
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Wallet className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Module Dépenses</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                    Cette fonctionnalité est en cours de développement. Vous pourrez bientôt gérer toutes vos dépenses ici.
                </p>
            </div>
        </div>
    );
}
