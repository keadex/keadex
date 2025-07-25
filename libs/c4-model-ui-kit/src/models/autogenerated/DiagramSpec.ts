// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { DiagramElementSpec } from "./DiagramElementSpec";
import type { DiagramOrientation } from "./DiagramOrientation";
import type { Shape } from "./Shape";

export interface DiagramSpec { uuid: string, description?: string, tags?: Array<string>, elements_specs: Array<DiagramElementSpec>, shapes: Array<Shape>, auto_layout_enabled: boolean, auto_layout_orientation: DiagramOrientation, auto_layout_only_straight_arrows: boolean, grid_enabled: boolean, }