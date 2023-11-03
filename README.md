<p align="center">
  <a href="https://keadex.io/kealab#keadex-battisti" target="blank"><img src="./static//keadex-logo-black.png" width="350" alt="Keadex Battisti Logo" /></a>
</p>
<p align="center"><i>Experiment. Learn. Share.</i></p>

<div align="center">

![GitHub](https://img.shields.io/github/license/keadex/keadex)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fkeadex.io&label=website&up_message=keadex.io)](https://keadex.io)
[![Website](https://img.shields.io/website?up_message=Keadex&up_color=5662F6&url=https%3A%2F%2Fdiscord.gg%2F92XZ5DNa&label=Discord)](https://discord.gg/92XZ5DNa)
[![Static Badge](https://img.shields.io/badge/Linkedin-0A66C2?logo=linkedin)
](https://www.linkedin.com/in/giacomosimmi/)
[![Static Badge](https://img.shields.io/badge/Spotify-1DD05D?logo=spotify&color=09451F)](http://open.spotify.com/user/jacksimmi)

</div>

<br>

## Introduction

**Keadex** is a project that aims to **experiment**, **learn** and provide **open source** solutions.

Some of the packages in this repo are experiments (:microscope:), some under development (:hourglass_flowing_sand:), while others are ready to use open source solutions (:white_check_mark:).

If you're interested in knowing more about Keadex, me or the provided solutions please visit [keadex.io](https://keadex.io), the [documentation](https://keadex.io/documentation) section or the [Discord channel](https://discord.gg/92XZ5DNa).

## Packages

### Applications

|           Type           | Package                                                                         | Short Description                                   | Version                                                                                                                                                       | Language(s)      | Framework(s)               |
| :----------------------: | ------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------------------- |
| :hourglass_flowing_sand: | [apps/keadex-docs](https://github.com/keadex/keadex/tree/main/apps/keadex-docs) | Website of the Keadex documentation.                | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=apps%2Fkeadex-docs%2Fpackage.json) | Typescript       | Docusaurus                 |
|    :white_check_mark:    | [apps/keadex-mina](https://github.com/keadex/keadex/tree/main/apps/keadex-mina) | Desktop app to create and manage C4 Model diagrams. | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=apps%2Fkeadex-mina%2Fpackage.json) | Typescript, Rust | Tauri, React, Tailwind CSS |

### Libraries

|        Type        | Package                                                                                 | Short Description                                                  | Version                                                                                                                                                           | Language(s) | Framework(s)        |
| :----------------: | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------- |
| :white_check_mark: | [libs/c4-model-ui-kit](https://github.com/keadex/keadex/tree/main/libs/c4-model-ui-kit) | Library that provides UI components to render C4 Model diagrams.   | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fc4-model-ui-kit%2Fpackage.json) | Typescript  | Fabric.js           |
| :white_check_mark: | [libs/keadex-ui-kit](https://github.com/keadex/keadex/tree/main/libs/keadex-ui-kit)     | Library that provides UI components to render Keadex applications. | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fkeadex-ui-kit%2Fpackage.json)   | Typescript  | React, Tailwind CSS |
| :white_check_mark: | [libs/keadex-utils](https://github.com/keadex/keadex/tree/main/libs/keadex-utils)       | Library that provides general purpose utilities.                   | ![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/keadex/keadex?filename=libs%2Fkeadex-utils%2Fpackage.json)    | Typescript  |                     |

## Get Started

This is a monorepo managed with [Nx](https://nx.dev/).

To start working on it:

- clone the repo: `git clone https://github.com/keadex/keadex.git`
- install the dependencies: `yarn`
- check the `project.json` file of each application or library for the list of the available Nx targets (commands can be executed - e.g. `yarn nx dev keadex-mina`)
