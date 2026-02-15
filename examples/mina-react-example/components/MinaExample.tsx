"use client";

import dynamic from "next/dynamic";

const MinaReact = dynamic(() => import("@keadex/mina-react"), {
  ssr: false,
});

export function MinaExample() {
  return (
    <div className="w-full h-screen">
      <MinaReact
        projectRootUrl="https://raw.githubusercontent.com/keadex/keadex/main/examples/mina-react-example/demo_mina_project/mina-demo"
        diagramUrl="https://raw.githubusercontent.com/keadex/keadex/main/examples/mina-react-example/demo_mina_project/mina-demo/diagrams/system-context/demo-diagram"
      />
    </div>
  );
}
