// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { DiagramPlantUML } from "./DiagramPlantUML";
import type { DiagramSpec } from "./DiagramSpec";
import type { DiagramType } from "./DiagramType";
import type { ElementData } from "./ElementData";

export interface Diagram { diagram_name?: string, diagram_type?: DiagramType, diagram_spec?: DiagramSpec, diagram_plantuml?: DiagramPlantUML, raw_plantuml?: string, last_modified?: string, auto_layout?: Record<string, ElementData>, }