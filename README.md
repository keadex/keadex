<p align="center">
  <a href="https://keadex.dev" target="blank"><img src="./static//keadex-logo-black.png" width="350" alt="Keadex Battisti Logo" /></a>
</p>
<p align="center"><i>Experiment. Learn. Share.</i></p>

<div align="center">

![GitHub](https://img.shields.io/github/license/keadex/keadex)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fkeadex.dev&label=website&up_message=keadex.dev)](https://keadex.dev)
[![Website](https://img.shields.io/website?up_message=Keadex&up_color=5662F6&url=https%3A%2F%2Fdiscord.gg%2FutCqK9jzJW&label=Discord)](https://discord.gg/utCqK9jzJW)
[![Static Badge](https://img.shields.io/badge/Linkedin-0A66C2?logo=linkedin)
](https://www.linkedin.com/in/giacomosimmi/)
[![Static Badge](https://img.shields.io/badge/Spotify-1DD05D?logo=spotify&color=09451F)](http://open.spotify.com/user/jacksimmi)

</div>

<br>

> [!IMPORTANT]
> Maintaining open-source solutions demands significant effort, especially since it’s not my primary job. However, Keadex is my passion, and I genuinely enjoy working on it.
>
> If you appreciate Keadex applications or libraries, I’m not asking for a coffee or a donation.</br>
> Instead, simply ⭐ **star** this repository and 📣 **share** it with your teams, colleagues, or community!

## Introduction

**Keadex** is a project that aims to **experiment**, **learn** and provide **open source** solutions.

Some of the packages in this repo are experiments ( :microscope: ), some under development ( :hourglass_flowing_sand: ), while others are ready to use open source solutions ( :white_check_mark: ).

💡 Do you have ideas you’d like to share? Are you interested in contributing to Keadex or learning more about it?
Feel free to reach out to me on my [Discord channel](https://discord.gg/utCqK9jzJW), or explore the Keadex [website](https://keadex.dev) and [documentation](https://keadex.dev/docs) for more information!

## Packages

### Applications

| Type               | Package                                                                                         | Short Description                                                | Version                                                                                                                                                               | Language(s)      | Framework(s)                  |
| ------------------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------------------------- |
| :white_check_mark: | [apps/keadex-battisti](https://github.com/keadex/keadex/tree/main/apps/keadex-battisti)         | Keadex Website & Documentation Platform.                         | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=apps%2Fkeadex-battisti%2Fpackage.json)     | Typescript, MDX  | Next.js, Nextra, Tailwing CSS |
| :white_check_mark: | [apps/keadex-diagrams](https://github.com/keadex/keadex/tree/main/apps/keadex-diagrams)         | Keadex architectural diagrams.                                   | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=apps%2Fkeadex-diagrams%2Fmina.json)        | PlantUML, JSON   | Keadex Mina                   |
| :white_check_mark: | [apps/keadex-mina](https://github.com/keadex/keadex/tree/main/apps/keadex-mina)                 | Desktop app to create and manage C4 Model diagrams.              | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=apps%2Fkeadex-mina%2Fpackage.json)         | Typescript, Rust | Tauri, React, Tailwind CSS    |
| :white_check_mark: | [apps/mina-confluence-app](https://github.com/keadex/keadex/tree/main/apps/mina-confluence-app) | Custom Confluence UI integrated into the Confluence Mina plugin. | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=apps%2Fmina-confluence-app%2Fpackage.json) | Typescript       | React, Atlassian Forge        |

### Libraries

| Type               | Package                                                                                               | Short Description                                                                          | Version                                                                                                                                                                                                                 | Language(s)      | Framework(s)        |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------- |
| :white_check_mark: | [libs/c4-model-ui-kit](https://github.com/keadex/keadex/tree/main/libs/c4-model-ui-kit)               | Library that provides UI components to render C4 Model diagrams.                           | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fc4-model-ui-kit%2Fpackage.json)                                                       | Typescript       | Fabric.js           |
| :white_check_mark: | [libs/docusaurus-plugin-mina](https://github.com/keadex/keadex/tree/main/libs/docusaurus-plugin-mina) | Library that provides the plugin to render Keadex Mina diagrams into Docusaurus.           | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fdocusaurus-plugin-mina%2Fpackage.json)                                                | Typescript       | React, Docusaurus   |
| :white_check_mark: | [libs/keadex-nx-plugin](https://github.com/keadex/keadex/tree/main/libs/keadex-nx-plugin)             | Library that provides the Nx plugin with Keadex executors and generators.                  | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fkeadex-nx-plugin%2Fpackage.json)                                                      | Typescript       | Nx                  |
| :white_check_mark: | [libs/keadex-ui-kit](https://github.com/keadex/keadex/tree/main/libs/keadex-ui-kit)                   | Library that provides UI components to render Keadex applications.                         | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fkeadex-ui-kit%2Fpackage.json)                                                         | Typescript       | React, Tailwind CSS |
| :white_check_mark: | [libs/keadex-utils](https://github.com/keadex/keadex/tree/main/libs/keadex-utils)                     | Library that provides general purpose utilities.                                           | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fkeadex-utils%2Fpackage.json)                                                          | Typescript       |                     |
| :white_check_mark: | [libs/mina-confluence-plugin](https://github.com/keadex/keadex/tree/main/libs/mina-confluence-plugin) | Library that provides the Confluence Macro to render Keadex Mina diagrams into Confluence. | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fmina-confluence-plugin%2Fpackage.json)                                                | Typescript       | Atlassian Forge     |
| :white_check_mark: | [libs/mina-cli](https://github.com/keadex/keadex/tree/main/libs/mina-cli)                             | Library that provides the CLI to interact with Mina projects.                              | ![Dynamic TOML Badge](https://img.shields.io/badge/dynamic/toml?url=https%3A%2F%2Fraw.githubusercontent.com%2Fkeadex%2Fkeadex%2Frefs%2Fheads%2Fmain%2Flibs%2Fmina-cli%2FCargo.toml&query=package.version&label=version) | Rust             |                     |
| :white_check_mark: | [libs/mina-react](https://github.com/keadex/keadex/tree/main/libs/mina-react)                         | Library that provides a React component to include Keadex Mina diagrams into React apps.   | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fmina-react%2Fpackage.json)                                                            | Typescript, WASM | React, Tailwind CSS |

## Examples

> [!WARNING]  
> Examples are not part of the Yarn workspace.
> Befor running an example make sure to install the dependencies (`yarn install`) in the root folder of the example.

| Package                                                                                                         | Description                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [examples/mina-react-example](https://github.com/keadex/keadex/tree/main/examples/mina-react-example)           | Example to demonstrate how to integrate the [Mina React](https://github.com/keadex/keadex/tree/main/libs/mina-react) component to render interactive C4 Model diagrams created with [Keadex Mina](https://github.com/keadex/keadex/tree/main/apps/keadex-mina). |
| [examples/mina-docusaurus-example](https://github.com/keadex/keadex/tree/main/examples/mina-docusaurus-example) | Example to demonstrate how to include in [Docusaurus](https://docusaurus.io) pages, interactive C4 Model diagrams created with [Keadex Mina](https://github.com/keadex/keadex/tree/main/apps/keadex-mina).                                                      |

## Get Started

This is a monorepo managed with [Nx](https://nx.dev/).

To start working on it:

- clone the repo: `git clone https://github.com/keadex/keadex.git`
- install the dependencies: `yarn`
- check the `project.json` file of each application or library for the list of the available Nx targets (commands can be executed - e.g. `yarn nx dev keadex-mina`)
