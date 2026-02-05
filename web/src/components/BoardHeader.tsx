import React, { useState, useEffect, useRef } from "react";
import { UserPlus, MoreHorizontal } from "lucide-react";
import { useBoard } from "@/context/BoardContext";

export function BoardHeader() {
  const { data, updateBoardTitle } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.boardTitle || "Board");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(data.boardTitle || "Board");
  }, [data.boardTitle]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (title.trim()) {
      updateBoardTitle(title.trim());
    } else {
      setTitle(data.boardTitle || "Board");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTitle(data.boardTitle || "Board");
    }
  };

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-black/10 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-1 min-w-0">
        <div className="flex items-center">
          {isEditing ? (
            <div className="relative inline-flex items-center min-w-[60px]">
              <span className="invisible whitespace-pre px-3 py-1.5 text-lg font-bold border-2 border-transparent">
                {title || "Board"}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 bg-[#1d2125]/80 text-white text-lg font-bold px-3 py-1.5 rounded outline-none border-2 border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.5)] w-full"
              />
            </div>
          ) : (
            <h1 
              onClick={() => setIsEditing(true)}
              className="text-lg font-bold text-white tracking-tight cursor-pointer hover:bg-white/20 px-3 py-1.5 rounded transition-colors truncate max-w-[400px]"
            >
              {title}
            </h1>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-900 rounded-sm text-[13px] font-medium hover:bg-white transition-colors shadow-sm">
          <UserPlus className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
        <button className="p-1.5 hover:bg-white/20 rounded text-white transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
