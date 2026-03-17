"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type DeleteConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    title: string;
};

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
    title
}: DeleteConfirmModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div 
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
                isOpen ? "opacity-100" : "opacity-0"
            )}
        >
            {/* Backdrop */}
            <div 
                className={cn(
                    "absolute inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Modal */}
            <div 
                className={cn(
                    "relative w-full max-w-[400px] bg-card border border-border rounded-[2.5rem] p-8 shadow-2xl transition-all duration-300 transform-gpu",
                    isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                )}
            >
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-6">
                        <AlertTriangle className="h-8 w-8" />
                    </div>
                    
                    <h2 className="text-xl font-bold text-foreground mb-2">Delete Note?</h2>
                    <p className="text-sm text-muted-foreground mb-8">
                        Are you sure you want to delete <span className="font-bold text-foreground">"{title || "Untitled Note"}"</span>? This action cannot be undone.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-12 rounded-xl border border-border bg-muted/30 font-bold text-sm text-foreground hover:bg-muted transition-all active:scale-[0.98]"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="h-12 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm shadow-lg shadow-destructive/20 hover:opacity-95 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : null}
                            {isDeleting ? "Deleting..." : "Yes, Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
