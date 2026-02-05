import React, { useState, useRef, useEffect } from "react";
import { List, Card } from "@/data/mockData";
import { CardItem } from "./CardItem";
import { MoreHorizontal, Plus, X } from "lucide-react";
import { useBoard } from "@/context/BoardContext";

interface ListColumnProps {
  list: List;
  cards: Card[];
}

export function ListColumn({ list, cards }: ListColumnProps) {
  const { addCardToList } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      <div className="bg-[#f1f2f4] rounded-xl flex flex-col max-h-full">
        <div className="p-3 flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-slate-700 px-1 truncate">
            {list.title}
          </h3>
          <button className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-500">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-slate-300">
          <div className="flex flex-col gap-2">
            {cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        </div>

        <div className="p-2 mt-auto">
          {isAdding ? (
            <div className="flex flex-col bg-[#f1f2f4] p-1 rounded-xl animate-in fade-in zoom-in duration-200">
              <textarea
                ref={textareaRef}
                autoFocus
                placeholder="Enter a title"
                className="w-full bg-white rounded-lg p-2 text-[14px] shadow-sm border-none focus:ring-2 focus:ring-[#0065ff] resize-none outline-none overflow-hidden"
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
                  className="bg-[#0065ff] hover:bg-[#0747a6] text-white px-3 py-1.5 rounded-md text-[14px] font-bold transition-colors"
                >
                  Add card
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md text-[14px] font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors group"
            >
              <Plus className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
              <span>Add a card</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
