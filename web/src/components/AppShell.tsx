import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { InboxColumn } from "./InboxColumn";
import { BottomNav } from "./BottomNav";
import { BoardView } from "./BoardView";
import { cn } from "@/utils/cn";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBoard } from "@/context/BoardContext";
import { CardItem } from "./CardItem";
import { ListColumn } from "./ListColumn";

const MIN_INBOX_WIDTH = 272;
const MIN_BOARD_WIDTH = 375;
const INBOX_CLOSE_THRESHOLD = 240;
const BOARD_CLOSE_THRESHOLD = 340;
const RESISTANCE_FACTOR = 0.4;

export function AppShell({ children }: { children?: ReactNode }) {
  const { data, moveCard, moveList } = useBoard();
  const [showInbox, setShowInbox] = useState(true);
  const [showBoard, setShowBoard] = useState(true);
  const [inboxWidth, setInboxWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inboxWidthRef = useRef(inboxWidth);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"card" | "list" | null>(null);

  const findContainer = (id: string) => {
    if (data.inboxIds.includes(id) || id === "inbox") return "inbox";
    return Object.keys(data.lists).find((key) => 
      data.lists[key].cardIds.includes(id) || key === id
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isMounted, setIsMounted] = useState(false);

  // Sync ref and container width
  useEffect(() => {
    setIsMounted(true);
    inboxWidthRef.current = inboxWidth;
  }, [inboxWidth]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      const observer = new ResizeObserver((entries) => {
        setContainerWidth(entries[0].contentRect.width);
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const isInboxClosing = isResizing && showBoard && inboxWidth < INBOX_CLOSE_THRESHOLD;
  const isBoardClosing = isResizing && showInbox && (containerWidth - inboxWidth - 36 < BOARD_CLOSE_THRESHOLD);

  const toggleInbox = () => {
    // Prevent hiding both
    if (showInbox && !showBoard) return;
    setShowInbox(!showInbox);
  };

  const toggleBoard = () => {
    // Prevent hiding both
    if (showBoard && !showInbox) return;
    setShowBoard(!showBoard);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const rawWidth = e.clientX - containerRect.left - 6; 
      
      let finalWidth = rawWidth;

      // Apply resistance if below minimum width
      if (rawWidth < MIN_INBOX_WIDTH) {
        finalWidth = MIN_INBOX_WIDTH - (MIN_INBOX_WIDTH - rawWidth) * RESISTANCE_FACTOR;
      } else {
        const maxNormalInboxWidth = containerWidth - 36 - MIN_BOARD_WIDTH;
        if (rawWidth > maxNormalInboxWidth) {
          const excess = rawWidth - maxNormalInboxWidth;
          finalWidth = maxNormalInboxWidth + excess * RESISTANCE_FACTOR;
        }
      }
      
      // Clamp to allow triggering thresholds but prevent total disappearance during drag
      const clampedWidth = Math.max(50, Math.min(finalWidth, containerWidth - 100));
      setInboxWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      if (!isResizing || !containerRef.current) {
        setIsResizing(false);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const currentWidth = inboxWidthRef.current;

      // Close if below threshold
      if (currentWidth < INBOX_CLOSE_THRESHOLD) {
        setShowInbox(false);
        setInboxWidth(320);
      } else if (containerWidth - currentWidth - 36 < BOARD_CLOSE_THRESHOLD) {
        setShowBoard(false);
        setInboxWidth(320);
      }

      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    };
  }, [isResizing]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveType(active.data.current?.type || "card");
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (activeType === "list") {
      const oldIndex = data.listOrder.indexOf(activeId);
      const newIndex = data.listOrder.indexOf(overId);
      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        moveList(activeId, newIndex);
      }
      return;
    }

    // Restriction: only works for cards
    if (!activeContainer || !overContainer || activeType !== "card") {
      return;
    }

    if (activeContainer !== overContainer) {
      const destIds = overContainer === "inbox" ? data.inboxIds : data.lists[overContainer].cardIds;
      const overIndex = over.data.current?.type === "card" 
        ? destIds.indexOf(overId)
        : destIds.length;
      
      moveCard(activeId, activeContainer, overContainer, overIndex);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    if (activeType === "card") {
      const destIds = overContainer === "inbox" ? data.inboxIds : data.lists[overContainer].cardIds;
      const oldIndex = destIds.indexOf(activeId);
      const newIndex = over.data.current?.type === "card" 
        ? destIds.indexOf(overId)
        : destIds.length;

      if (oldIndex !== newIndex) {
        moveCard(activeId, overContainer, overContainer, newIndex);
      }
    } else if (activeType === "list") {
      const oldIndex = data.listOrder.indexOf(activeId);
      const newIndex = data.listOrder.indexOf(overId);
      if (oldIndex !== newIndex) {
        moveList(activeId, newIndex);
      }
    }
  };

  const activeCard = activeId ? data.cards[activeId] : null;

  return (
    <DndContext
      id="main-dnd-context"
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div 
        ref={containerRef}
        className={cn(
          "flex h-screen w-full overflow-hidden bg-[#23272e] p-3 font-sans",
          isResizing && "select-none"
        )}
      >
        {/* Persistent Left Column / Full Screen Inbox */}
        {showInbox && (
          <div 
            style={showBoard ? { width: `${inboxWidth}px` } : {}}
            className={cn(
              "h-full overflow-hidden rounded-2xl shadow-2xl bg-[#0d3375] border border-[#424957] transition-opacity duration-200",
              showBoard ? "shrink-0" : "flex-1",
              isInboxClosing && "opacity-50 grayscale-[0.5]"
            )}
          >
            <InboxColumn isFullScreen={!showBoard} />
          </div>
        )}

        {/* Resize Divider */}
        {showInbox && showBoard && (
          <div
            onMouseDown={handleMouseDown}
            className={cn(
              "group relative w-3 h-full cursor-col-resize flex items-center justify-center shrink-0",
              isResizing && "z-50"
            )}
            aria-label="Drag to resize"
            role="slider"
            aria-valuenow={inboxWidth}
            aria-valuemin={MIN_INBOX_WIDTH}
            aria-valuemax={containerWidth - MIN_BOARD_WIDTH}
          >
            {/* Invisible larger hit area + visible line on hover/drag */}
            <div className={cn(
              "w-1 h-8 rounded-full bg-[#424957] transition-all duration-200 group-hover:h-12 group-hover:bg-[#5a6270]",
              isResizing && "h-16 bg-[#7c8594]"
            )} />
          </div>
        )}

        {/* Main Content Area / Full Screen Board */}
        {showBoard && (
          <main className={cn(
            "relative flex flex-col h-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-[#6225b8] to-[#b02c67] border border-[#424957] transition-opacity duration-200",
            showInbox ? "flex-1 min-w-0" : "w-full",
            isBoardClosing && "opacity-50 grayscale-[0.5]"
          )}>
            <div className="flex-1 overflow-hidden">
              {children || <BoardView />}
            </div>
          </main>
        )}

        {/* Floating Bottom Navigation */}
        <BottomNav 
          showInbox={showInbox} 
          showBoard={showBoard} 
          onToggleInbox={toggleInbox} 
          onToggleBoard={toggleBoard} 
        />
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: "0.5",
            },
          },
        }),
      }}>
        {activeId && activeType === "card" && activeCard && (
          <CardItem 
            card={activeCard} 
            isInbox={data.inboxIds.includes(activeId)} 
            isOverlay 
          />
        )}
        {activeId && activeType === "list" && data.lists[activeId] && (
          <ListColumn
            list={data.lists[activeId]}
            cards={data.lists[activeId].cardIds.map((id) => data.cards[id])}
            isOverlay
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
