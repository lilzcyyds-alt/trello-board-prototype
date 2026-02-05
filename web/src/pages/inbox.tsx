import Head from "next/head";
import { AppShell } from "@/components/AppShell";

export default function InboxPage() {
  return (
    <>
      <Head>
        <title>Inbox · Trello Prototype</title>
      </Head>
      <AppShell>
        <div className="px-8 py-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Inbox
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              (Scaffold) This will replicate Trello Inbox look & interactions.
            </p>
          </header>

          <section className="max-w-3xl">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-sm font-medium text-slate-900">Items</div>
              <ul className="mt-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <li
                    key={i}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
                  >
                    Inbox item {i}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </AppShell>
    </>
  );
}
