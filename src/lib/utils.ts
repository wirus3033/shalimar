import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formate une date ISO en format d'affichage (jj/mm/aaaa)
 * @param dateStr Date au format ISO (ex: 2026-01-24)
 * @returns Date formatée (ex: 24/01/2026)
 */
export function formatDate(dateStr: string | Date | undefined): string {
    if (!dateStr) return "-";
    try {
        const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
        return format(date, "dd/MM/yyyy", { locale: fr });
    } catch (error) {
        console.error("Error formatting date:", error);
        return "-";
    }
}

/**
 * Prépare une date pour un input HTML (format yyyy-mm-dd) sans décalage horaire
 * @param dateStr Date au format ISO ou Date object
 * @returns Date formatée (ex: 2026-01-24)
 */
export function toInputDate(dateStr: string | Date | undefined): string {
    if (!dateStr) return "";
    try {
        const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
        // On utilise format sans fuseau horaire pour éviter le décalage
        return format(date, "yyyy-MM-dd");
    } catch (error) {
        console.error("Error converting to input date:", error);
        return "";
    }
}
