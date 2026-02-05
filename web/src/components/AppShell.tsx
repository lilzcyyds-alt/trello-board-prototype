import React, { useState, type ReactNode } from "react";
import { InboxColumn } from "./InboxColumn";
import { BottomNav } from "./BottomNav";
import { BoardView } from "./BoardView";
import { cn } from "@/utils/cn";

export function AppShell({ children }: { children?: ReactNode }) {
  const [showInbox, setShowInbox] = useState(true);
  const [showBoard, setShowBoard] = useState(true);

  const toggleInbox = () => {
    // Prevent hiding both
    if (showInbox && !showBoard) return;
    setShowInbox(!showInbox);
  };

  const toggleBoard = () => {
    // Prevent hiding both
    if (showBoard && !showInbox) return;
    setShowBoard(!showBoard);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#23272e] p-3 gap-3 font-sans">
      {/* Persistent Left Column / Full Screen Inbox */}
      {showInbox && (
        <div className={cn(
          "h-full overflow-hidden rounded-2xl shadow-2xl bg-[#0d3375] border border-[#424957]",
          showBoard ? "w-[320px] shrink-0" : "flex-1"
        )}>
          <InboxColumn isFullScreen={!showBoard} />
        </div>
      )}

      {/* Main Content Area / Full Screen Board */}
      {showBoard && (
        <main className={cn(
          "relative flex flex-col h-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-[#6225b8] to-[#b02c67] border border-[#424957]",
          showInbox ? "flex-1 min-w-0" : "w-full"
        )}>
          <div className="flex-1 overflow-hidden">
            {children || <BoardView />}
          </div>
        </main>
      )}

      {/* Floating Bottom Navigation */}
      <BottomNav 
        showInbox={showInbox} 
        showBoard={showBoard} 
        onToggleInbox={toggleInbox} 
        onToggleBoard={toggleBoard} 
      />
    </div>
  );
}
