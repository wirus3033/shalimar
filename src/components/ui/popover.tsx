"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverProps {
    children: React.ReactNode
}

interface PopoverTriggerProps {
    asChild?: boolean
    children: React.ReactNode
}

interface PopoverContentProps {
    children: React.ReactNode
    align?: "start" | "center" | "end"
    className?: string
}

const PopoverContext = React.createContext<{
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
    open: false,
    setOpen: () => { },
})

const Popover = ({ children }: PopoverProps) => {
    const [open, setOpen] = React.useState(false)

    return (
        <PopoverContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block">{children}</div>
        </PopoverContext.Provider>
    )
}

const PopoverTrigger = ({ asChild, children }: PopoverTriggerProps) => {
    const { setOpen } = React.useContext(PopoverContext)

    const handleClick = () => {
        setOpen((prev) => !prev)
    }

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: handleClick,
        })
    }

    return <div onClick={handleClick}>{children}</div>
}

const PopoverContent = ({ children, align = "center", className }: PopoverContentProps) => {
    const { open, setOpen } = React.useContext(PopoverContext)
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [open, setOpen])

    if (!open) return null

    const alignmentClasses = {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0",
    }

    return (
        <div
            ref={contentRef}
            className={cn(
                "absolute z-50 mt-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl animate-in fade-in-0 zoom-in-95",
                alignmentClasses[align],
                className
            )}
        >
            {children}
        </div>
    )
}

Popover.displayName = "Popover"
PopoverTrigger.displayName = "PopoverTrigger"
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
