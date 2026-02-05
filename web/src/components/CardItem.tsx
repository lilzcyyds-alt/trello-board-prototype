import React from "react";
import { Card as CardType } from "@/data/mockData";
import { Mail, MessageSquare, Chrome } from "lucide-react";

const sourceIcons = {
  email: <Mail className="w-3 h-3" />,
  slack: <MessageSquare className="w-3 h-3" />,
  teams: <MessageSquare className="w-3 h-3" />,
  chrome: <Chrome className="w-3 h-3" />,
};

interface CardItemProps {
  card: CardType;
}

export function CardItem({ card }: CardItemProps) {
  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 p-3 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer select-none active:scale-[0.98]">
      <div className="text-[13px] font-medium text-slate-800 leading-snug">
        {card.title}
      </div>
      {card.source && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          {sourceIcons[card.source]}
          <span>{card.source}</span>
        </div>
      )}
    </div>
  );
}
