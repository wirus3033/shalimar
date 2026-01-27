"use client";

import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Calendar as CalendarIcon, Filter, Layers } from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { reservationService, Reservation } from "@/services/reservation.service";
import { roomService, Room } from "@/services/room.service";
import { roomStatusService, RoomStatus } from "@/services/room-status.service";
import {
    format,
    parseISO,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isWithinInterval,
    addMonths,
    subMonths,
    startOfDay,
    differenceInDays,
    isAfter,
    isBefore,
    addDays
} from "date-fns";
import { fr } from "date-fns/locale";

export default function PlanningTimelinePage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [statuses, setStatuses] = useState<RoomStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [roomsData, reservationsData, statusesData] = await Promise.all([
                roomService.getAll(),
                reservationService.getAll(),
                roomStatusService.getAll()
            ]);
            setRooms(roomsData.sort((a, b) => String(a.numero_Chambre).localeCompare(String(b.numero_Chambre), undefined, { numeric: true })));
            setReservations(reservationsData);
            setStatuses(statusesData);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Erreur lors de la récupération des données de planning.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    // Filter reservations that overlap with the current month
    const visibleReservations = useMemo(() => {
        return reservations.filter(res => {
            const resStart = startOfDay(parseISO(res.date_entree));
            const resEnd = startOfDay(parseISO(res.date_sortie));
            return (
                (resStart <= monthEnd && resEnd >= monthStart)
            );
        });
    }, [reservations, monthStart, monthEnd]);

    if (isLoading && rooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-green-500/20 rounded-full animate-pulse"></div>
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-slate-500 font-medium animate-pulse">Chargement du planning...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                {/* <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg shadow-green-500/20">
                        <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            Planning Occupancy
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">
                            Tableau de bord de disponibilité en temps réel
                        </p>
                    </div>
                </div> */}

                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={previousMonth}
                        className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm text-slate-600 dark:text-slate-400 transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="px-6 py-2 min-w-[160px] text-center">
                        <span className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                            {format(currentDate, "MMMM yyyy", { locale: fr })}
                        </span>
                    </div>
                    <button
                        onClick={nextMonth}
                        className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm text-slate-600 dark:text-slate-400 transition-all active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={goToToday}
                        className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                    >
                        Aujourd'hui
                    </button>

                    <div className="relative">
                        <input
                            type="date"
                            value={format(currentDate, "yyyy-MM-dd")}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setCurrentDate(parseISO(e.target.value));
                                }
                            }}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        />
                        <button
                            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                        >
                            <CalendarIcon className={`w-5 h-5 ${isLoading ? "animate-spin text-green-500" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold animate-in slide-in-from-top-4">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Timeline View */}
            <div className="flex-1 min-h-[500px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto custom-scrollbar" ref={scrollContainerRef}>
                    <div className="min-w-max relative">
                        {/* Timeline Header (Days) */}
                        <div className="flex sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                            {/* Sticky corner space */}
                            <div className="w-48 sticky left-0 z-50 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 flex flex-col justify-center p-4">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Chambres</span>
                                <p className="text-xs font-bold text-slate-500">{rooms.length} au total</p>
                            </div>

                            {/* Days labels */}
                            <div className="flex">
                                {days.map((day) => {
                                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                    const isToday = isSameDay(day, new Date());
                                    return (
                                        <div
                                            key={day.toString()}
                                            className={`w-14 h-20 flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800/50 relative
                                                ${isWeekend ? "bg-slate-50/50 dark:bg-slate-800/20" : ""}
                                                ${isToday ? "bg-green-50/50 dark:bg-green-900/10" : ""}
                                            `}
                                        >
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{format(day, "EEE", { locale: fr })}</span>
                                            <span className={`text-lg font-black mt-1 ${isToday ? "text-green-500" : "text-slate-800 dark:text-white"}`}>
                                                {format(day, "d")}
                                            </span>
                                            {isToday && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-t-full"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Room Rows */}
                        <div className="relative">
                            {rooms.map((room) => (
                                <div key={room.IDChambre} className="flex group">
                                    {/* Sticky Room Label */}
                                    <div className="w-48 sticky left-0 z-30 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex items-center p-4 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {/* <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-green-500/50 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-all">
                                                {room.numero_Chambre}
                                            </div> */}
                                            <div>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Chambre {room.numero_Chambre}</p>
                                                {/* <p className="text-[10px] text-slate-400 font-medium">
                                                    {statuses.find(s => s.idStatus === room.IDstatusChambre)?.libele || "Classique"} • {room.tarif} Ar
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid Cells */}
                                    <div className="flex relative">
                                        {days.map((day) => {
                                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                            return (
                                                <div
                                                    key={day.toString()}
                                                    className={`w-14 h-16 border-r border-b border-slate-100 dark:border-slate-800/30
                                                        ${isWeekend ? "bg-slate-50/30 dark:bg-slate-800/10" : ""}
                                                    `}
                                                />
                                            );
                                        })}

                                        {/* Reservations Bars Layer */}
                                        <div className="absolute inset-0 pointer-events-none">
                                            {visibleReservations
                                                .filter(res => res.IDChambre === room.IDChambre)
                                                .map(res => {
                                                    const start = startOfDay(parseISO(res.date_entree));
                                                    const end = startOfDay(parseISO(res.date_sortie));

                                                    // Calculate visual start and end within current month
                                                    const visualStart = isBefore(start, monthStart) ? monthStart : start;
                                                    const visualEnd = isAfter(end, monthEnd) ? monthEnd : end;

                                                    const startIndex = differenceInDays(visualStart, monthStart);
                                                    const durationVisible = differenceInDays(visualEnd, visualStart) + 1;

                                                    const left = startIndex * 56; // 14 * 4 = 56px (w-14 is 3.5rem = 56px)
                                                    const width = durationVisible * 56;

                                                    return (
                                                        <div
                                                            key={res.IDReservation}
                                                            className="absolute top-2 h-12 pointer-events-auto cursor-pointer transition-all hover:scale-[1.02] hover:z-20 group/bar"
                                                            style={{ left: `${left}px`, width: `${width}px` }}
                                                        >
                                                            <div className={`h-full mx-1 p-2 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 border-l-4 border-yellow-500 rounded-xl shadow-lg shadow-yellow-500/10 flex flex-col justify-center overflow-hidden relative group-hover/bar:shadow-yellow-500/30 animate-in fade-in zoom-in-95 duration-500`}>
                                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 animate-pulse"></div>
                                                                    <p className="text-[10px] font-black text-yellow-900 dark:text-yellow-100 truncate uppercase tracking-tighter">
                                                                        {res.nom_client}
                                                                    </p>
                                                                </div>
                                                                <p className="text-[9px] text-yellow-700/80 dark:text-yellow-400/80 font-bold mt-0.5 truncate">
                                                                    {format(start, "d MMM")} - {format(end, "d MMM")}
                                                                </p>

                                                                {/* Tooltip on hover */}
                                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                                                                    <p className="font-bold">{res.nom_client}</p>
                                                                    <p className="text-slate-400">Total: {parseFloat(String(res.montant_total)).toLocaleString()} Ar</p>
                                                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-t-slate-900 border-l-transparent border-r-transparent"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer / Legend */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-100 border-l-2 border-yellow-500 rounded shadow-sm"></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Réservé</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/20"></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aujourd'hui</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded"></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disponible</span>
                        </div>
                    </div>

                    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <Filter className="w-3 h-3" />
                        {visibleReservations.length} RÉSERVATIONS VISIBLES CE MOIS
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}
