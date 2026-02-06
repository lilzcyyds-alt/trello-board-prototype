import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BoardData, Card, mockData, LIST_COLORS } from "@/data/mockData";

interface BoardContextType {
  data: BoardData;
  addCardToInbox: (title: string) => void;
  removeCardFromInbox: (cardId: string) => void;
  removeCard: (cardId: string, containerId: string) => void;
  addCardToList: (listId: string, title: string) => void;
  updateBoardTitle: (title: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  addList: (title: string) => void;
  moveCard: (cardId: string, sourceContainer: string, destContainer: string, index: number) => void;
  moveList: (listId: string, index: number) => void;
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

  const removeCardFromInbox = (cardId: string) => {
    setData((prev) => ({
      ...prev,
      inboxIds: prev.inboxIds.filter((id) => id !== cardId),
    }));
  };

  const removeCard = (cardId: string, containerId: string) => {
    setData((prev) => {
      if (containerId === "inbox") {
        return {
          ...prev,
          inboxIds: prev.inboxIds.filter((id) => id !== cardId),
        };
      }
      
      const list = prev.lists[containerId];
      if (!list) return prev;

      return {
        ...prev,
        lists: {
          ...prev.lists,
          [containerId]: {
            ...list,
            cardIds: list.cardIds.filter((id) => id !== cardId),
          },
        },
      };
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

  const updateListTitle = (listId: string, title: string) => {
    setData((prev) => {
      const list = prev.lists[listId];
      if (!list) return prev;
      return {
        ...prev,
        lists: {
          ...prev.lists,
          [listId]: {
            ...list,
            title,
          },
        },
      };
    });
  };

  const deleteList = (listId: string) => {
    setData((prev) => {
      const newListOrder = prev.listOrder.filter((id) => id !== listId);
      const newLists = { ...prev.lists };
      delete newLists[listId];
      
      // Also clean up cards that were in this list? 
      // For simplicity, we just remove the list from order and list map.
      return {
        ...prev,
        listOrder: newListOrder,
        lists: newLists,
      };
    });
  };

  const addList = (title: string) => {
    const newId = `list-${Date.now()}`;
    setData((prev) => {
      const color = LIST_COLORS[prev.listOrder.length % LIST_COLORS.length];
      return {
        ...prev,
        lists: {
          ...prev.lists,
          [newId]: {
            id: newId,
            title,
            cardIds: [],
            color,
          },
        },
        listOrder: [...prev.listOrder, newId],
      };
    });
  };

  const moveCard = (cardId: string, sourceContainer: string, destContainer: string, index: number) => {
    setData((prev) => {
      const newData = { ...prev };
      
      // 1. Remove from source
      if (sourceContainer === "inbox") {
        newData.inboxIds = newData.inboxIds.filter(id => id !== cardId);
      } else {
        const sourceList = newData.lists[sourceContainer];
        if (sourceList) {
          newData.lists = {
            ...newData.lists,
            [sourceContainer]: {
              ...sourceList,
              cardIds: sourceList.cardIds.filter(id => id !== cardId),
            }
          };
        }
      }

      // 2. Add to destination
      if (destContainer === "inbox") {
        const newInboxIds = [...newData.inboxIds];
        newInboxIds.splice(index, 0, cardId);
        newData.inboxIds = newInboxIds;
      } else {
        const destList = newData.lists[destContainer];
        if (destList) {
          const newCardIds = [...destList.cardIds];
          newCardIds.splice(index, 0, cardId);
          newData.lists = {
            ...newData.lists,
            [destContainer]: {
              ...destList,
              cardIds: newCardIds,
            }
          };
        }
      }

      return newData;
    });
  };

  const moveList = (listId: string, index: number) => {
    setData((prev) => {
      const newListOrder = prev.listOrder.filter(id => id !== listId);
      newListOrder.splice(index, 0, listId);
      return {
        ...prev,
        listOrder: newListOrder,
      };
    });
  };

  return (
    <BoardContext.Provider value={{ 
      data, 
      addCardToInbox, 
      removeCardFromInbox, 
      removeCard,
      addCardToList, 
      updateBoardTitle,
      updateListTitle,
      deleteList,
      addList,
      moveCard,
      moveList
    }}>
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
