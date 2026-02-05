import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { BoardProvider } from "@/context/BoardContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BoardProvider>
      <Component {...pageProps} />
    </BoardProvider>
  );
}
