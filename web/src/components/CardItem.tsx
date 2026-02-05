import React, { useState } from "react";
import { Card as CardType } from "@/data/mockData";
import { Mail, MessageSquare, Chrome, Circle } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/utils/cn";
import { useBoard } from "@/context/BoardContext";

const sourceIcons = {
  email: <Mail className="w-3 h-3" />,
  slack: <MessageSquare className="w-3 h-3" />,
  teams: <MessageSquare className="w-3 h-3" />,
  chrome: <Chrome className="w-3 h-3" />,
};

interface CardItemProps {
  card: CardType;
  isInbox?: boolean;
  isOverlay?: boolean;
  containerId?: string;
}

export function CardItem({ card, isInbox, isOverlay, containerId }: CardItemProps) {
  const { removeCard } = useBoard();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: card.id,
    data: {
      type: "card",
      container: containerId || (isInbox ? "inbox" : ""),
    },
    disabled: isCompleting || isRemoving,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleting || isRemoving) return;
    
    setIsCompleting(true);
    
    // Wait for blast animation (600ms) + small pause
    setTimeout(() => {
      setIsRemoving(true);
      
      // Wait for row exit animation (400ms)
      setTimeout(() => {
        removeCard(card.id, containerId || (isInbox ? "inbox" : ""));
        setIsCompleting(false);
        setIsRemoving(false);
      }, 400);
    }, 800);
  };

  const activeContainerId = containerId || (isInbox ? "inbox" : "");

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative flex flex-col bg-[#252930] rounded-xl p-3 shadow-sm transition-all duration-500 border border-transparent hover:border-[#8db1f0] cursor-grab active:cursor-grabbing select-none overflow-hidden",
        isDragging && "opacity-20 border-dashed border-slate-400 bg-slate-100 shadow-none",
        isOverlay && "shadow-xl border-[#8db1f0] cursor-grabbing scale-105",
        isRemoving && "opacity-0 -translate-x-8 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-0">
        <button
          onClick={handleComplete}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "shrink-0 transition-all duration-200 z-10 mr-0 flex items-center justify-center",
            (isCompleting || isRemoving) 
              ? "opacity-100 w-6" 
              : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-6"
          )}
        >
          <div className={cn(
            "w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 relative",
            isCompleting ? "bg-green-500/20" : "hover:bg-slate-700"
          )}>
            <Circle className={cn(
              "w-4 h-4 transition-all duration-300",
              isCompleting 
                ? "text-green-500 fill-green-500 animate-pop" 
                : "text-slate-400 group-hover:text-slate-300"
            )} />

            {isCompleting && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-green-500 rounded-full animate-blast"
                    style={{ '--angle': `${i * 45}deg` } as React.CSSProperties}
                  />
                ))}
              </div>
            )}
          </div>
        </button>

        <div className={cn(
          "text-[13px] font-medium text-[#ffffff] leading-snug truncate transition-all duration-200",
          isDragging && "invisible"
        )}>
          {card.title}
        </div>
      </div>

      {card.source && !isDragging && (
        <div className={cn(
          "mt-2 flex items-center gap-1.5 text-[10px] text-[#828487] font-bold uppercase tracking-wider transition-all duration-200",
          (isCompleting || isRemoving) 
            ? "ml-6" 
            : "ml-0 group-hover:ml-6"
        )}>
          {sourceIcons[card.source as keyof typeof sourceIcons]}
          <span>{card.source}</span>
        </div>
      )}
    </div>
  );
}
