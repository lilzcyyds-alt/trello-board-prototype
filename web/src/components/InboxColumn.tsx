import React, { useState, useRef, useEffect } from "react";
import { Lock, Plus, X, Inbox, Circle } from "lucide-react";
import { cn } from "@/utils/cn";
import { useBoard } from "@/context/BoardContext";

export function InboxColumn({ isFullScreen }: InboxColumnProps) {
  const { data, addCardToInbox } = useBoard();
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const inboxCards = data.inboxIds.map((id) => data.cards[id]).filter(Boolean);

  const handleAddCard = () => {
    if (inputValue.trim()) {
      addCardToInbox(inputValue.trim());
      setInputValue("");
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddCard();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setInputValue("");
    }
  };

  return (
    <aside className={cn(
      "text-slate-200 flex flex-col h-full",
      isFullScreen ? "items-center" : ""
    )}>
      <div className={cn(
        "p-4 pb-2 flex flex-col gap-3 w-full",
        isFullScreen ? "max-w-4xl" : ""
      )}>
        <div className="flex items-center gap-2">
          <Inbox className="w-4 h-4 text-white" />
          <h2 className="text-lg font-bold text-white tracking-tight">Inbox</h2>
        </div>

        {isAdding ? (
          <div className="flex flex-col bg-[#101204] p-2 rounded-xl shadow-lg animate-in fade-in zoom-in duration-200">
            <textarea
              ref={textareaRef}
              autoFocus
              placeholder="Enter a title"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-[#22272b] text-white rounded-lg p-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#85b8ff] border-none resize-none overflow-hidden"
              rows={1}
            />
            <div className="flex items-center gap-1 mt-2">
              <button
                onClick={handleAddCard}
                className="bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] px-3 py-1.5 rounded-md text-sm font-bold transition-colors"
              >
                Add card
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setInputValue("");
                }}
                className="text-white hover:bg-white/10 px-3 py-1.5 rounded-md text-sm font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center gap-2 bg-[#334155]/50 hover:bg-[#334155] border border-transparent hover:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-400 transition-all text-left"
          >
            <Plus className="w-4 h-4" />
            <span>Add a card</span>
          </button>
        )}
      </div>

      <div className={cn(
        "flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 w-full",
        isFullScreen ? "max-w-4xl" : ""
      )}>
        {inboxCards.map((card) => (
          <div
            key={card.id}
            className="group relative flex items-center gap-3 p-2 rounded-lg hover:bg-[#334155] cursor-pointer transition-colors border border-transparent hover:border-slate-600 shadow-sm"
          >
            <Circle className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="text-sm font-medium leading-tight truncate">{card.title}</div>
          </div>
        ))}
      </div>

      <div className={cn(
        "p-4 mt-auto border-t border-white/5 flex items-center gap-2 text-slate-500 w-full",
        isFullScreen ? "max-w-4xl" : ""
      )}>
        <Lock className="w-3.5 h-3.5" />
        <span className="text-[11px] font-medium">Inbox is only visible to you</span>
      </div>
    </aside>
  );
}
