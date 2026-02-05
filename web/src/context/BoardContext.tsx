import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BoardData, Card, mockData } from "@/data/mockData";

interface BoardContextType {
  data: BoardData;
  addCardToInbox: (title: string) => void;
  addCardToList: (listId: string, title: string) => void;
  updateBoardTitle: (title: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<BoardData>(mockData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("trello-board-data");
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse board data from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("trello-board-data", JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const addCardToInbox = (title: string) => {
    const newId = `c-${Date.now()}`;
    const newCard: Card = {
      id: newId,
      title: title,
    };

    setData((prev) => {
      const newData = {
        ...prev,
        cards: {
          ...prev.cards,
          [newId]: newCard,
        },
        inboxIds: [newId, ...prev.inboxIds],
      };
      return newData;
    });
  };

  const addCardToList = (listId: string, title: string) => {
    const newId = `c-${Date.now()}`;
    const newCard: Card = {
      id: newId,
      title: title,
    };

    setData((prev) => {
      const list = prev.lists[listId];
      if (!list) return prev;

      const newData = {
        ...prev,
        cards: {
          ...prev.cards,
          [newId]: newCard,
        },
        lists: {
          ...prev.lists,
          [listId]: {
            ...list,
            cardIds: [...list.cardIds, newId],
          },
        },
      };
      return newData;
    });
  };

  const updateBoardTitle = (title: string) => {
    setData((prev) => ({
      ...prev,
      boardTitle: title,
    }));
  };

  return (
    <BoardContext.Provider value={{ data, addCardToInbox, addCardToList, updateBoardTitle }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
