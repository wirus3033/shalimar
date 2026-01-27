"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface DatePickerProps {
    date?: Date
    onDateChange?: (date: Date | undefined) => void
    placeholder?: string
    disabled?: (date: Date) => boolean
    className?: string
    fromDate?: Date
    toDate?: Date
}

export function DatePicker({
    date,
    onDateChange,
    placeholder = "Sélectionner une date",
    disabled,
    className,
    fromDate,
    toDate,
}: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "w-full h-12 px-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-green-500/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 text-slate-900 dark:text-white transition-all shadow-sm flex items-center justify-between",
                        !date && "text-slate-400",
                        className
                    )}
                >
                    <span className="flex items-center gap-3">
                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                        {date ? format(date, "PPP", { locale: fr }) : placeholder}
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onDateChange}
                    disabled={disabled}
                    fromDate={fromDate}
                    toDate={toDate}
                    initialFocus
                    locale={fr}
                />
            </PopoverContent>
        </Popover>
    )
}
