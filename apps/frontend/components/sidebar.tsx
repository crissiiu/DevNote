"use client";

import { useState } from "react";
import { 
  Hash, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Settings, 
  LogOut, 
  Bookmark,
  Clock,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

import { Tag } from "@/lib/types/note";

interface SidebarProps {
  onLogout: () => void;
  onSearchOpen?: () => void;
  onCreateNote: () => void;
  tags?: Tag[];
  activeTagId?: string | null;
  onSelectTag?: (id: string | null) => void;
}

export function Sidebar({ 
  onLogout, 
  onCreateNote, 
  onSearchOpen,
  tags = [], 
  activeTagId, 
  onSelectTag 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // const menuItems = [
  //   { icon: Search, label: "Search", shortcut: "⌘K", onClick: () => onSearchOpen?.() },
  //   { icon: Clock, label: "Recent", active: !activeTagId },
  // ];

  return (
    <aside 
      className={cn(
        "relative flex h-full flex-col bg-muted/40 border-r border-border transition-all duration-300 ease-in-out shadow-sm",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header / User Info */}
      <div className="flex h-20 items-center gap-3 px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
          <Bookmark className="h-6 w-6 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            <h2 className="truncate text-base font-black tracking-tight text-foreground">DevNote</h2>
            <p className="truncate text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Personal Workspace</p>
          </div>
        )}
      </div>

      {/* New Note Button */}
      <div className="px-3 mt-4">
        <button
          onClick={onCreateNote}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl bg-primary px-3 py-2.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]",
            isCollapsed && "justify-center px-0"
          )}
        >
          <Plus className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-90" />
          {!isCollapsed && <span className="truncate">New Note</span>}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-4 px-2 pt-4">
        <div className="space-y-1">
          <button
                onClick={() => onSelectTag?.(null)}
                className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition-all hover:bg-muted active:scale-95",
                    !activeTagId ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"
                )}
             >
                <LayoutGrid className="h-4 w-4 opacity-50" />
                {!isCollapsed && <span className="flex-1 text-left">All Notes</span>}
          </button> 
          {/* {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition-all hover:bg-muted active:scale-95",
                item.active ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", item.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.shortcut && (
                    <span className="text-[10px] font-medium opacity-50">{item.shortcut}</span>
                  )}
                </>
              )}
            </button>
          ))} */}
        </div>

        <div className="pt-4">
          {!isCollapsed && (
             <div className="px-3 mb-2 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Your Tags</h3>
                <Plus 
                  className="h-3 w-3 text-muted-foreground/60 hover:text-primary cursor-pointer transition-colors" 
                  onClick={onCreateNote}
                />
             </div>
          )}
          <div className="space-y-1">
             {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onSelectTag?.(tag.id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold transition-all hover:bg-muted active:scale-95",
                    activeTagId === tag.id ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Hash className="h-4 w-4 opacity-50" />
                  {!isCollapsed && <span className="flex-1 text-left truncate">{tag.name}</span>}
                </button>
             ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto space-y-2 p-2 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
            <ThemeToggle />
            {!isCollapsed && (
                <button
                    onClick={onLogout}
                    className="flex flex-1 items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </button>
            )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-all hover:scale-110 hover:bg-muted active:scale-95"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
