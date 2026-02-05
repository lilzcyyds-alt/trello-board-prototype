import Head from "next/head";
import { useRouter } from "next/router";
import { AppShell } from "@/components/AppShell";

export default function BoardPage() {
  const router = useRouter();
  const boardId = typeof router.query.id === "string" ? router.query.id : "demo";

  return (
    <>
      <Head>
        <title>Board · {boardId} · Trello Prototype</title>
      </Head>
      <AppShell>
        <div className="flex h-screen flex-col">
          <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Board: {boardId}
                </h1>
                <div className="mt-0.5 text-xs text-slate-500">
                  (Scaffold) Header + columns will be replicated.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Star
                </button>
                <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Share
                </button>
                <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  •••
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-x-auto overflow-y-hidden px-6 py-4">
              <div className="flex h-full gap-4">
                {[
                  "Inbox",
                  "To do",
                  "Doing",
                  "Done",
                ].map((title) => (
                  <div
                    key={title}
                    className="w-72 shrink-0 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div className="mb-3 text-sm font-semibold text-slate-900">
                      {title}
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
                        >
                          Card {i}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
