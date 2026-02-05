import React from "react";
import { Inbox, Layout } from "lucide-react";
import { cn } from "@/utils/cn";

interface BottomNavProps {
  showInbox: boolean;
  showBoard: boolean;
  onToggleInbox: () => void;
  onToggleBoard: () => void;
}

export function BottomNav({ showInbox, showBoard, onToggleInbox, onToggleBoard }: BottomNavProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 p-1.5 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <button
          onClick={onToggleInbox}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all",
            showInbox 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
              : "text-slate-400 hover:text-white hover:bg-white/10"
          )}
        >
          <Inbox className="w-4 h-4" />
          <span>Inbox</span>
        </button>
        
        <button
          onClick={onToggleBoard}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all",
            showBoard 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
              : "text-slate-400 hover:text-white hover:bg-white/10"
          )}
        >
          <Layout className="w-4 h-4" />
          <span>Board</span>
        </button>
      </nav>
    </div>
  );
}
