import React, { useState, useRef, useEffect } from "react";
import { List, Card } from "@/data/mockData";
import { CardItem } from "./CardItem";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { useBoard } from "@/context/BoardContext";
import { cn } from "@/utils/cn";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ListColumnProps {
  list: List;
  cards: Card[];
  isOverlay?: boolean;
}

export function ListColumn({ list, cards, isOverlay }: ListColumnProps) {
  const { addCardToList, updateListTitle, deleteList } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "list",
      container: list.id,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  useEffect(() => {
    setListTitle(list.title);
  }, [list.title]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (listTitle.trim() && listTitle !== list.title) {
      updateListTitle(list.id, listTitle.trim());
    } else {
      setListTitle(list.title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setListTitle(list.title);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [title]);

  const handleAddCard = () => {
    if (title.trim()) {
      addCardToList(list.id, title.trim());
      setTitle("");
      setIsAdding(false);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[280px] shrink-0 h-[80px] rounded-xl border-2 border-dashed border-white/20 bg-white/5 shadow-none"
      />
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "w-[280px] shrink-0 flex flex-col max-h-full",
        isOverlay && "cursor-grabbing"
      )}
    >
      <div 
        className="backdrop-blur-md rounded-xl flex flex-col max-h-full border border-white/10 shadow-sm"
        style={list.color ? { backgroundColor: `${list.color}25` } : { backgroundColor: "rgba(16, 18, 4, 0.4)" }}
      >
        <div 
          {...(isMounted ? attributes : {})}
          {...(isMounted ? listeners : {})}
          className="p-3 flex items-center justify-between cursor-grab active:cursor-grabbing rounded-t-xl"
        >
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="bg-white/10 text-white text-[13px] font-bold px-1 py-0.5 rounded outline-none w-full mr-2"
              style={{ borderColor: list.color || "#3b82f6", borderStyle: "solid", borderWidth: "1px" }}
            />
          ) : (
            <h3 
              onClick={() => setIsEditingTitle(true)}
              className="text-[13px] font-bold text-white/90 px-1 truncate cursor-pointer hover:bg-white/5 rounded transition-colors flex-1 mr-2"
            >
              {list.title}
            </h3>
          )}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/50 shrink-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-[#282e33] border border-white/10 rounded-lg shadow-xl z-50 p-1 animate-in fade-in zoom-in duration-150">
                <div className="px-3 py-2 text-[12px] font-bold text-white/50 border-b border-white/5 mb-1">
                  List actions
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${list.title}"?`)) {
                      deleteList(list.id);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] text-red-400 hover:bg-white/5 rounded transition-colors"
                >
                  Delete list
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-slate-300">
          <div className="flex flex-col gap-2">
            <SortableContext
              id={list.id}
              items={list.cardIds}
              strategy={verticalListSortingStrategy}
            >
              {cards.map((card) => (
                <CardItem 
                  key={card.id} 
                  card={card} 
                  containerId={list.id}
                />
              ))}
            </SortableContext>
          </div>
        </div>

        <div className="p-2 mt-auto">
          {isAdding ? (
            <div className="flex flex-col bg-[#101204] p-1 rounded-xl animate-in fade-in zoom-in duration-200 shadow-lg">
              <textarea
                ref={textareaRef}
                autoFocus
                placeholder="Enter a title"
                className="w-full bg-[#22272b] text-white rounded-lg p-2 text-[14px] shadow-sm border-none focus:ring-2 focus:ring-[#85b8ff] resize-none outline-none overflow-hidden"
                rows={1}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddCard();
                  }
                }}
              />
              <div className="flex items-center gap-1 mt-2">
                <button
                  onClick={handleAddCard}
                  className="bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] px-3 py-1.5 rounded-md text-[14px] font-bold transition-colors"
                >
                  Add card
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-white hover:bg-white/10 px-3 py-1.5 rounded-md text-[14px] font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium text-white/60 hover:bg-white/10 rounded-lg transition-colors group"
            >
              <Plus className="w-4 h-4 text-white/40 group-hover:text-white/80" />
              <span>Add a card</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
