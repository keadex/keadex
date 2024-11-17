// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ElementType } from "./ElementType";
import type { Position } from "./Position";
import type { Shape } from "./Shape";
import type { Size } from "./Size";

export interface DiagramElementSpec { alias?: string, from?: string, to?: string, shapes?: Array<Shape>, element_type?: ElementType, position?: Position, size?: Size, inner_specs?: Array<DiagramElementSpec>, }