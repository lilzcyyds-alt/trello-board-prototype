import Head from "next/head";
import { useRouter } from "next/router";
import { BoardHeader } from "@/components/BoardHeader";
import { ListColumn } from "@/components/ListColumn";
import { useBoard } from "@/context/BoardContext";
import { Plus } from "lucide-react";

export function BoardView() {
  const router = useRouter();
  const boardId = typeof router.query.id === "string" ? router.query.id : "demo";

  const { data } = useBoard();
  const { lists, listOrder, cards } = data;

  return (
    <div className="flex flex-col h-full w-full">
      <BoardHeader />

      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-white/20">
        <div className="flex h-full items-start gap-3 p-4">
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

          {/* Add another list button */}
          <button className="w-[280px] shrink-0 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl p-3 flex items-center gap-2 text-white text-[13px] font-bold transition-all h-fit border border-white/10">
            <Plus className="w-4 h-4" />
            <span>Add another list</span>
          </button>
        </div>
      </div>
    </div>
  );
}
