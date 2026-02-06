export interface Card {
  id: string;
  title: string;
  source?: "email" | "slack" | "teams" | "chrome";
}

export interface List {
  id: string;
  title: string;
  cardIds: string[];
  color?: string;
}

export const LIST_COLORS = [
  "#579dff", // Blue
  "#4bce97", // Green
  "#f5cd47", // Yellow
  "#fea362", // Orange
  "#f87168", // Red
  "#9f8fef", // Purple
  "#e774bb", // Pink
  "#60c6d2", // Teal
];

export interface BoardData {
  cards: Record<string, Card>;
  lists: Record<string, List>;
  listOrder: string[];
  inboxIds: string[];
  boardTitle: string;
}

export const mockData: BoardData = {
  boardTitle: "Product Board",
  cards: {
    "c1": { id: "c1", title: "Review marketing proposal" },
    "c2": { id: "c2", title: "Update README with new workflow" },
    "c3": { id: "c3", title: "Respond to customer inquiry" },
    "c4": { id: "c4", title: "Fix bug in the navigation dock" },
    "c5": { id: "c5", title: "Prepare for the team meeting" },
    "c6": { id: "c6", title: "Implement dark mode for inbox" },
    "c7": { id: "c7", title: "Research dnd-kit for drag and drop" },
    "c8": { id: "c8", title: "Create pixel-perfect UI states" },
  },
  lists: {
    "list-todo": {
      id: "list-todo",
      title: "Today",
      cardIds: ["c1", "c2"],
      color: "#579dff",
    },
    "list-doing": {
      id: "list-doing",
      title: "This Week",
      cardIds: ["c3", "c4", "c5"],
      color: "#4bce97",
    },
    "list-done": {
      id: "list-done",
      title: "Later",
      cardIds: ["c6"],
      color: "#f5cd47",
    },
  },
  listOrder: ["list-todo", "list-doing", "list-done"],
  inboxIds: ["c7", "c8", "c3"], // Some cards can overlap for mock purposes
};
