import Head from "next/head";
import { AppShell } from "@/components/AppShell";
import { BoardView } from "@/components/BoardView";

export default function BoardPage() {
  return (
    <>
      <Head>
        <title>Board | Trello Prototype</title>
      </Head>
      <AppShell>
        <BoardView />
      </AppShell>
    </>
  );
}
