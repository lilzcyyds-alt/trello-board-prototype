# Trello Board Prototype

A high-fidelity functional prototype replicating **Trello's Inbox and Board** experience with **complex UI interactions**, **advanced drag-and-drop mechanics**, and pixel-perfect visual design.

## Technical Highlights

This project implements several **complex features** often found in production-grade applications:

- **Advanced Drag & Drop System**: Bi-directional card movement between Inbox and Board using `@dnd-kit` with custom collision detection (`rectIntersection`) and dynamic container lookup
- **Complex Animation Sequences**: Multi-stage animations including pop effects, 8-particle blast radiations, and coordinated fade/slide exits with precise timing (800ms delay + 400ms exit)
- **Resizable Panel Layout**: Custom-built resizable divider with resistance zones, snap-to-close thresholds, and visual feedback (opacity/grayscale during drag)
- **Normalized State Management**: Context-based state with normalized data structure supporting cross-container card operations and real-time updates
- **Versioned Persistence**: LocalStorage with version control to handle data migration and corruption fallback
- **Micro-interactions**: Hover-triggered indent animations, auto-expanding textareas, and state-preserving animations (circle remains visible during exit)

## Reference Component

This project replicates the following Trello features:

- **Trello Inbox** — A persistent left-side column for quick task capture and completion
  - Add cards with auto-expanding textarea
  - Completion circle animation (pop + blast effect)
  - Drag-and-drop support for reordering

- **Trello Board** — Multi-column kanban view with full CRUD operations
  - Horizontal scrollable lists
  - Add/rename/delete lists with color coding
  - Drag cards between lists and reorder
  - Editable board title

- **Advanced Layout Features**
  - Resizable divider between Inbox and Board panels
  - Snap-to-close behavior when dragging panels
  - Toggle visibility with bottom navigation dock
  - 2-layer design with floating rounded panels

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Libraries & Tools Used

### Core Framework
- **Next.js 15** (Pages Router) — React framework
- **React 19** — UI library
- **TypeScript** — Type safety

### Styling
- **Tailwind CSS v4** — Utility-first CSS framework
- **clsx** — Conditional class name utility
- **tailwind-merge** — Merge Tailwind classes without conflicts

### Drag & Drop
- **@dnd-kit/core** — Drag and drop toolkit
- **@dnd-kit/sortable** — Sortable component primitives
- **@dnd-kit/utilities** — Utility functions for dnd-kit

### Icons & Assets
- **lucide-react** — Icon library (Inbox, Layout, Plus, Circle, etc.)

### AI Tools
- **Claude Code** — Used for:
  - Component scaffolding and initial structure generation
  - Real-time style adjustments and refactoring
  - Spec documentation creation and validation
  - Code review and optimization suggestions

## Workflow Efficiency Report

### Method 1: AI-Powered Component Scaffolding

**Strategy**: Used Claude Code to accelerate component development by providing detailed specifications and iterating through conversational programming.

**Implementation**:
1. Wrote detailed spec documents describing each component's behavior, styling, and interactions
2. Fed specs to Claude Code to generate initial component structure with TypeScript types
3. Iteratively refined through conversation (e.g., "adjust the shadow to match Trello exactly", "add resistance factor to resizable divider")
4. Claude Code handled boilerplate code, allowing me to focus on design decisions

**Impact**: Reduced initial component setup time by ~40%. Instead of manually writing repetitive code (state management, event handlers, TypeScript interfaces), I focused on visual accuracy and user experience.

### Method 2: Incremental Visual Testing with Centralized Mock Data

**Strategy**: Developed components in isolation using a shared `mockData.ts` file with hot reload for instant visual feedback.

**Implementation**:
1. Created a centralized `mockData.ts` with normalized data structure (cards, lists, board state)
2. Built each component independently (InboxColumn, BoardView, CardItem, ListColumn)
3. Used Next.js hot reload + Tailwind's utility classes for real-time style adjustments
4. Tested drag-and-drop interactions incrementally before integrating into main app

**Impact**: Avoided integration bugs by testing components in isolation. Tailwind's utility-first approach enabled rapid visual iteration (e.g., changing `p-3` to `p-4` and seeing results instantly). This workflow prevented the "build everything then debug" anti-pattern.

## Features

**Dual-Panel Layout**
- Side-by-side Inbox and Board views
- Resizable divider with resistance and snap-to-close
- Toggle visibility via bottom navigation dock

**Advanced Drag & Drop System**
- **Cross-container dragging**: Move cards freely between Inbox and any Board list
- **Bi-directional support**: Cards can flow both ways (Inbox ↔ Board)
- **Multi-level sorting**: Reorder cards within lists AND reorder list columns horizontally
- **Custom collision detection**: Uses `rectIntersection` algorithm for accurate drop zones
- **Visual feedback**: Drag overlay with reduced opacity, dashed borders for drop targets
- **Keyboard accessible**: Full keyboard navigation support via `@dnd-kit`

**CRUD Operations**
- Add/edit/delete cards
- Add/rename/delete lists
- Edit board title

**Persistent State**
- LocalStorage-based persistence
- Survives page refreshes
- Fallback to mock data if storage is empty/corrupted

**Complex UI Interactions & Animations**
- **Hover choreography**: Completion circle fades in while title text indents smoothly (0 → 32px padding-left)
- **Multi-stage completion animation**:
  1. Click triggers scale-up "pop" effect on circle
  2. 8-particle "blast" radiates outward at 45° intervals
  3. 800ms visible delay before exit
  4. Coordinated fade-out + slide-left exit animation (400ms)
  5. State preservation: circle/indent remain during mouse-out
- **Resizable divider mechanics**:
  - Resistance factor (0.4) below minimum widths
  - Visual feedback: opacity + grayscale during close zone
  - Snap-to-close with threshold detection
- **Auto-expanding textareas**: Dynamic height adjustment based on content
- **Smooth transitions**: Blue border highlights, backdrop blur effects, glassmorphism

## Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── AppShell.tsx          # Main layout with resizable panels
│   │   ├── InboxColumn.tsx       # Inbox view component
│   │   ├── BoardView.tsx         # Board view component
│   │   ├── CardItem.tsx          # Card component with drag support
│   │   ├── ListColumn.tsx        # List column component
│   │   ├── BoardHeader.tsx       # Board header with title
│   │   └── BottomNav.tsx         # Navigation dock
│   ├── context/
│   │   └── BoardContext.tsx      # Global state management
│   ├── data/
│   │   └── mockData.ts           # Centralized mock data
│   ├── pages/
│   │   ├── _app.tsx              # App wrapper with BoardProvider
│   │   ├── index.tsx             # Home page with AppShell
│   │   └── api/                  # API routes (unused)
│   └── utils/
│       └── cn.ts                 # Tailwind class merge utility
└── public/                       # Static assets
```

## Key Design Decisions

### Color System
- **Background**: `#23272e` (dark slate)
- **Inbox Panel**: `#0d3375` (deep blue)
- **Board Panel**: Gradient `#6225b8` → `#b02c67` (purple to pink)
- **Cards**: `#252930` with white text
- **Primary Action**: `#579dff` (bright blue)

### Layout Constraints
- **Inbox**: Default 320px, minimum 272px, close threshold 240px
- **Board**: Minimum 375px, close threshold 340px
- **Resistance Factor**: 0.4 (40% slower movement below minimum)

### Accessibility
- Keyboard navigation for drag-and-drop
- Focus states with ring outline
- Semantic HTML (aside, main, nav)
- ARIA labels for resizable divider

## Notes

- **No Backend**: All data stored in browser LocalStorage
- **No Authentication**: Single-user experience only
- **Card Detail Modal**: Not implemented (prioritized core features)
- **Responsive Design**: Optimized for desktop (horizontal scrolling on smaller screens)

## Reference Documentation

Detailed spec documents are available in `/spec_doc/`:
- `1.0_overview.md` — Project overview and goals
- `2.1_inbox_page.md` — Inbox component specification
- `2.3_board_page_layout.md` — Board layout specification
- `2.7_drag_drop_cards.md` — Card drag-and-drop behavior
- `2.11_scroll_responsive_layout.md` — Resizable layout specification

---

**Built using AI-assisted development**
