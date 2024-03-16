<p align="center">
  <img src="https://raw.githubusercontent.com/keadex/keadex/main/libs/docusaurus-plugin-mina/static/mina-docusaurus-logo.svg" width="400" alt="Keadex Mina React Logo" />
</p>

<div align="center">

![GitHub](https://img.shields.io/github/license/keadex/keadex)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fdocusaurus-plugin-mina%2Fpackage.json)
[![NPM Version](https://img.shields.io/npm/v/%40keadex%2Fdocusaurus-plugin-mina)](https://www.npmjs.com/package/@keadex/docusaurus-plugin-mina)

</div>

## Quick Overview

This Docusaurus plugin injects Webpack configurations to include into Docusaurus pages interactive C4 Model diagrams created with [Keadex Mina](https://keadex.dev/en/projects/keadex-mina) through the [Mina React](https://github.com/keadex/keadex/tree/main/libs/mina-react) component.

<div align="center" style="margin-top: 20px">
  <img src="https://raw.githubusercontent.com/keadex/keadex/main/libs/docusaurus-plugin-mina/static/mina-docusaurus.gif" alt="Keadex Mina Docusaurus plugin demo" width="70%" />
</div>

## Usage

### Install

```shell
yarn add @keadex/docusaurus-plugin-mina # or npm install @keadex/docusaurus-plugin-mina
yarn add @keadex/mina-react # or npm install @keadex/mina-react
```

### Add the plugin

`docusaurus.config.js`

```JS
const config = {
  // your Docusaurus config
  plugins: ['@keadex/docusaurus-plugin-mina']
}

export default config
```

### Include the diagram into MDX files

`my-mina-diagram.mdx`

```md
---
sidebar_position: 1
---

# My Mina Diagram

import MinaReact from '@keadex/mina-react'

<div style={{height: '50rem'}}>
  <MinaReact
    projectRootUrl="https://raw.githubusercontent.com/keadex/keadex/main/examples/mina-react-example/demo_mina_project/Mina%20Demo"
    diagramUrl="https://raw.githubusercontent.com/keadex/keadex/main/examples/mina-react-example/demo_mina_project/Mina%20Demo/diagrams/system-context/demo-diagram"
  />
</div>
```
