# 2.13 README + Workflow Efficiency Report

## Summary
Prepare the submission narrative and required documentation.

## Requirements
- README must include:
  - What was replicated (exact reference: Trello Inbox + Board)
  - How to run locally
  - Libraries used (Next.js, Tailwind, dnd-kit, etc.)
  - AI/tools used (Cursor/Copilot/ChatGPT) if any
  - Workflow Efficiency Report (1–2 concrete tactics)

## Technical Implementation Details
- **Libraries used**:
  - `Next.js` (Pages Router)
  - `TailwindCSS` (v4)
  - `lucide-react` for high-fidelity icons
  - `clsx` and `tailwind-merge` for dynamic class management
  - `dnd-kit` (setup for future drag-and-drop)
- **Component Architecture**:
  - Persistent `InboxColumn` for quick access to incoming tasks.
  - Multi-column `Board` view with horizontal scrolling.
  - Floating `BottomNav` dock for seamless navigation between views.

## Suggested Efficiency Report bullets
- **Tailwind Utility Patterns**: Used `clsx` and `tailwind-merge` with a custom `cn` utility to handle complex conditional styling (e.g., glassmorphism, hover states).
- **Mock-First Development**: Built a centralized `mockData.ts` to allow both Inbox and Board components to share the same data model, ensuring visual consistency across views.
- **Lucide Icons**: Integrated `lucide-react` to quickly match Trello's visual language for emails, slack messages, and chrome tasks.

## Acceptance Criteria
- Reviewer can run project in < 2 minutes
- Doc clearly explains tradeoffs and tool usage
