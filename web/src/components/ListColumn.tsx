import React, { useState, useRef, useEffect } from "react";
import { List, Card } from "@/data/mockData";
import { CardItem } from "./CardItem";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { useBoard } from "@/context/BoardContext";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ListColumnProps {
  list: List;
  cards: Card[];
}

export function ListColumn({ list, cards }: ListColumnProps) {
  const { addCardToList } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { setNodeRef } = useDroppable({
    id: list.id,
    data: {
      type: "container",
      container: list.id,
    },
  });

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

  return (
    <div className="w-[280px] shrink-0 flex flex-col max-h-full">
      <div 
        ref={setNodeRef}
        className="bg-[#101204]/40 backdrop-blur-sm rounded-xl flex flex-col max-h-full border border-white/5"
      >
        <div className="p-3 flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-white/90 px-1 truncate">
            {list.title}
          </h3>
          <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/50">
            <MoreHorizontal className="w-4 h-4" />
          </button>
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
