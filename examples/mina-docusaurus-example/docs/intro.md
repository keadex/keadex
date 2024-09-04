---
sidebar_position: 1
---

# My Mina Diagram

import BrowserOnly from '@docusaurus/BrowserOnly';

<div style={{height: '50rem'}}>
  <BrowserOnly fallback={<div>Loading...</div>}>
    {() => {
      const MinaReact = require('@keadex/mina-react').default;
      return <MinaReact
          projectRootUrl="https://raw.githubusercontent.com/keadex/keadex/main/examples/mina-react-example/demo_mina_project/Mina%20Demo"
          diagramUrl="https://raw.githubusercontent.com/keadex/keadex/main/examples/mina-react-example/demo_mina_project/Mina%20Demo/diagrams/system-context/demo-diagram"
        />;
    }}
  </BrowserOnly>
</div>
