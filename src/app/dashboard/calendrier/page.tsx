"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function CalendrierPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const monthNames = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];

    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

    const previousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    // Sample bookings data
    const bookings: { [key: number]: number } = {
        27: 2,
        28: 3,
        29: 1,
        30: 4,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1>
                        Calendrier
                    </h1>
                    <p className="mt-1">
                        Vue d'ensemble des réservations
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={previousMonth}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <div className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Calendar */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                {/* Day Names */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400 py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square" />
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const hasBookings = bookings[day];
                        const isToday = day === 26; // Simulating today as 26th

                        return (
                            <div
                                key={day}
                                className={`aspect-square p-2 rounded-xl border transition-all cursor-pointer ${isToday
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <div className="flex flex-col h-full">
                                    <span
                                        className={`text-sm font-semibold ${isToday
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-slate-900 dark:text-white"
                                            }`}
                                    >
                                        {day}
                                    </span>
                                    {hasBookings && (
                                        <div className="mt-auto">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                                    {hasBookings}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3>
                    Légende
                </h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                            Aujourd'hui
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                            Réservations
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
