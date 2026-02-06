import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { BoardHeader } from "@/components/BoardHeader";
import { ListColumn } from "@/components/ListColumn";
import { useBoard } from "@/context/BoardContext";
import { Plus, X } from "lucide-react";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

export function BoardView() {
  const router = useRouter();
  const boardId = typeof router.query.id === "string" ? router.query.id : "demo";

  const { data, addList } = useBoard();
  const { lists, listOrder, cards } = data;

  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingList && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingList]);

  const handleAddList = () => {
    if (newListTitle.trim()) {
      addList(newListTitle.trim());
      setNewListTitle("");
      setIsAddingList(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddList();
    } else if (e.key === "Escape") {
      setIsAddingList(false);
      setNewListTitle("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <BoardHeader />

      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-white/20">
        <div className="flex h-full items-start gap-3 p-4">
          <SortableContext 
            items={listOrder} 
            strategy={horizontalListSortingStrategy}
          >
            {listOrder.map((listId) => {
              const list = lists[listId];
              const listCards = list.cardIds.map((id) => cards[id]);
              return (
                <ListColumn
                  key={listId}
                  list={list}
                  cards={listCards}
                />
              );
            })}
          </SortableContext>

          {/* Add another list button */}
          {isAddingList ? (
            <div className="w-[280px] shrink-0 bg-[#101204] p-3 rounded-xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter list title..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#22272b] text-white rounded-lg p-2 text-[14px] shadow-inner border-none focus:ring-2 focus:ring-[#85b8ff] outline-none mb-3"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddList}
                  className="bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] px-3 py-1.5 rounded-md text-[14px] font-bold transition-colors"
                >
                  Add list
                </button>
                <button
                  onClick={() => setIsAddingList(false)}
                  className="text-white hover:bg-white/10 p-1.5 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAddingList(true)}
              className="w-[280px] shrink-0 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl p-3 flex items-center gap-2 text-white text-[13px] font-bold transition-all h-fit border border-white/10 group"
            >
              <Plus className="w-4 h-4 text-white/60 group-hover:text-white" />
              <span>Add another list</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
