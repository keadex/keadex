"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MinaLive = dynamic(() => import("@keadex/mina-live"), {
  ssr: false,
});

export function MinaExample() {
  const [currentOrigin, setCurrentOrigin] = useState<null | string>();

  useEffect(() => {
    if (location) {
      // Access the current page URL using window.location
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentOrigin(location.origin);
    }
  }, []);

  if (currentOrigin) {
    return (
      <MinaLive
        scriptPath={`${currentOrigin}/_next/static/chunks/mina_live_worker_wasm.js`}
      />
    );
  } else {
    return <></>;
  }
}
