"use client";

import dynamic from "next/dynamic";

import "@keadex/mina-live/index.css";
const MinaLive = dynamic(() => import("@keadex/mina-live"), {
  ssr: false,
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type MinaLiveClientProps = {};

export default function MinaLiveClient() {
  return <MinaLive />;
}
