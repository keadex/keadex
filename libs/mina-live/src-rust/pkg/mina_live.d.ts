/* tslint:disable */
/* eslint-disable */
export function init_app(): void;
export function create_project(project_settings: ProjectSettings, dir_handle?: FileSystemDirectoryHandle | null): Promise<ProjectSettings>;
export function open_project(dir_handle?: FileSystemDirectoryHandle | null): Promise<Project>;
export function close_project(): Promise<boolean>;
export type BoundaryType = "Enterprise_Boundary" | "System_Boundary" | "Container_Boundary" | "Boundary";

export type RelationshipType = "Rel_Neighbor" | "Rel_Back_Neighbor" | "Rel_Back" | "Rel_Down" | "Rel_D" | "Rel_Up" | "Rel_U" | "Rel_Left" | "Rel_L" | "Rel_Right" | "Rel_R" | "Rel" | "BiRel_Neighbor" | "BiRel_Down" | "BiRel_D" | "BiRel_Up" | "BiRel_U" | "BiRel_Left" | "BiRel_L" | "BiRel_Right" | "BiRel_R" | "BiRel";

export type ComponentType = "Component" | "Component_Ext" | "ComponentDb" | "ComponentDb_Ext" | "ComponentQueue" | "ComponentQueue_Ext";

export type ContainerType = "Container" | "Container_Ext" | "ContainerDb" | "ContainerDb_Ext" | "ContainerQueue" | "ContainerQueue_Ext";

export type DiagramType = "SYSTEM_CONTEXT" | "CONTAINER" | "COMPONENT" | "SYSTEM_LANDSCAPE" | "DYNAMIC" | "DEPLOYMENT";

export type PersonType = "Person" | "Person_Ext";

export type ElementType = {
  Boundary: BoundaryType;
  Component?: null;
  Container?: null;
  DeploymentNode?: null;
  Person?: null;
  Relationship?: null;
  SoftwareSystem?: null;
} | {
  Component: ComponentType;
  Boundary?: null;
  Container?: null;
  DeploymentNode?: null;
  Person?: null;
  Relationship?: null;
  SoftwareSystem?: null;
} | {
  Container: ContainerType;
  Boundary?: null;
  Component?: null;
  DeploymentNode?: null;
  Person?: null;
  Relationship?: null;
  SoftwareSystem?: null;
} | {
  DeploymentNode: DeploymentNodeType;
  Boundary?: null;
  Component?: null;
  Container?: null;
  Person?: null;
  Relationship?: null;
  SoftwareSystem?: null;
} | {
  Person: PersonType;
  Boundary?: null;
  Component?: null;
  Container?: null;
  DeploymentNode?: null;
  Relationship?: null;
  SoftwareSystem?: null;
} | {
  Relationship: RelationshipType;
  Boundary?: null;
  Component?: null;
  Container?: null;
  DeploymentNode?: null;
  Person?: null;
  SoftwareSystem?: null;
} | {
  SoftwareSystem: SystemType;
  Boundary?: null;
  Component?: null;
  Container?: null;
  DeploymentNode?: null;
  Person?: null;
  Relationship?: null;
};

export type DeploymentNodeType = "Node" | "Node_R" | "Node_L" | "Deployment_Node" | "Deployment_Node_R" | "Deployment_Node_L";

export type DiagramElementType = {
  Include: string;
  Comment?: null;
  Person?: null;
  SoftwareSystem?: null;
  Container?: null;
  Component?: null;
  Boundary?: null;
  DeploymentNode?: null;
  Relationship?: null;
} | {
  Comment: string;
  Include?: null;
  Person?: null;
  SoftwareSystem?: null;
  Container?: null;
  Component?: null;
  Boundary?: null;
  DeploymentNode?: null;
  Relationship?: null;
} | {
  Person: Person;
  Include?: null;
  Comment?: null;
  SoftwareSystem?: null;
  Container?: null;
  Component?: null;
  Boundary?: null;
  DeploymentNode?: null;
  Relationship?: null;
} | {
  SoftwareSystem: SoftwareSystem;
  Include?: null;
  Comment?: null;
  Person?: null;
  Container?: null;
  Component?: null;
  Boundary?: null;
  DeploymentNode?: null;
  Relationship?: null;
} | {
  Container: Container;
  Include?: null;
  Comment?: null;
  Person?: null;
  SoftwareSystem?: null;
  Component?: null;
  Boundary?: null;
  DeploymentNode?: null;
  Relationship?: null;
} | {
  Component: Component;
  Include?: null;
  Comment?: null;
  Person?: null;
  SoftwareSystem?: null;
  Container?: null;
  Boundary?: null;
  DeploymentNode?: null;
  Relationship?: null;
} | {
  Boundary: Boundary;
  Include?: null;
  Comment?: null;
  Person?: null;
  SoftwareSystem?: null;
  Container?: null;
  Component?: null;
  DeploymentNode?: null;
  Relationship?: null;
} | {
  DeploymentNode: DeploymentNode;
  Include?: null;
  Comment?: null;
  Person?: null;
  SoftwareSystem?: null;
  Container?: null;
  Component?: null;
  Boundary?: null;
  Relationship?: null;
} | {
  Relationship: Relationship;
  Include?: null;
  Comment?: null;
  Person?: null;
  SoftwareSystem?: null;
  Container?: null;
  Component?: null;
  Boundary?: null;
  DeploymentNode?: null;
};

export type DiagramOrientation = "TopToBottom" | "LeftToRight";

export type SystemType = "System" | "System_Ext" | "SystemDb" | "SystemDb_Ext" | "SystemQueue" | "SystemQueue_Ext";

export type ShapeType = "LINE" | "DOT" | "TEXT" | "TRIANGLE" | "RECTANGLE" | "FOOTER";

export class AISettings {
  private constructor();
  free(): void;
  get api_key(): string | undefined;
  set api_key(value: string | null | undefined);
  get api_base_url(): string | undefined;
  set api_base_url(value: string | null | undefined);
  get model(): string | undefined;
  set model(value: string | null | undefined);
}
export class BaseElement {
  private constructor();
  free(): void;
  get alias(): string | undefined;
  set alias(value: string | null | undefined);
  get label(): string | undefined;
  set label(value: string | null | undefined);
  get description(): string | undefined;
  set description(value: string | null | undefined);
  get sprite(): string | undefined;
  set sprite(value: string | null | undefined);
  get tags(): string | undefined;
  set tags(value: string | null | undefined);
  get link(): string | undefined;
  set link(value: string | null | undefined);
  get uuid(): string | undefined;
  set uuid(value: string | null | undefined);
  get notes(): string | undefined;
  set notes(value: string | null | undefined);
}
export class Boundary {
  private constructor();
  free(): void;
  base_data: BaseElement;
  get boundary_type(): BoundaryType | undefined;
  set boundary_type(value: BoundaryType | null | undefined);
  get boundary_custom_type(): string | undefined;
  set boundary_custom_type(value: string | null | undefined);
  sub_elements: DiagramElementType[];
}
export class C4Elements {
  private constructor();
  free(): void;
  persons: Person[];
  software_systems: SoftwareSystem[];
  containers: Container[];
  components: Component[];
  deployment_nodes: DeploymentNode[];
  relationships: Relationship[];
  boundaries: Boundary[];
}
export class Component {
  private constructor();
  free(): void;
  base_data: BaseElement;
  get technology(): string | undefined;
  set technology(value: string | null | undefined);
  get component_type(): ComponentType | undefined;
  set component_type(value: ComponentType | null | undefined);
}
export class Container {
  private constructor();
  free(): void;
  base_data: BaseElement;
  get technology(): string | undefined;
  set technology(value: string | null | undefined);
  get container_type(): ContainerType | undefined;
  set container_type(value: ContainerType | null | undefined);
}
export class DeploymentNode {
  private constructor();
  free(): void;
  base_data: BaseElement;
  get deploymeny_node_custom_type(): string | undefined;
  set deploymeny_node_custom_type(value: string | null | undefined);
  get deployment_node_type(): DeploymentNodeType | undefined;
  set deployment_node_type(value: DeploymentNodeType | null | undefined);
  sub_elements: DiagramElementType[];
}
export class Diagram {
  private constructor();
  free(): void;
  get diagram_name(): string | undefined;
  set diagram_name(value: string | null | undefined);
  get diagram_type(): DiagramType | undefined;
  set diagram_type(value: DiagramType | null | undefined);
  get diagram_spec(): DiagramSpec | undefined;
  set diagram_spec(value: DiagramSpec | null | undefined);
  get diagram_plantuml(): DiagramPlantUML | undefined;
  set diagram_plantuml(value: DiagramPlantUML | null | undefined);
  get raw_plantuml(): string | undefined;
  set raw_plantuml(value: string | null | undefined);
  get last_modified(): string | undefined;
  set last_modified(value: string | null | undefined);
  auto_layout: any;
}
export class DiagramElementSpec {
  private constructor();
  free(): void;
  get alias(): string | undefined;
  set alias(value: string | null | undefined);
  get from(): string | undefined;
  set from(value: string | null | undefined);
  get to(): string | undefined;
  set to(value: string | null | undefined);
  get shapes(): Shape[] | undefined;
  set shapes(value: Shape[] | null | undefined);
  get element_type(): ElementType | undefined;
  set element_type(value: ElementType | null | undefined);
  get position(): Position | undefined;
  set position(value: Position | null | undefined);
  get size(): Size | undefined;
  set size(value: Size | null | undefined);
  get inner_specs(): DiagramElementSpec[] | undefined;
  set inner_specs(value: DiagramElementSpec[] | null | undefined);
}
export class DiagramPlantUML {
  private constructor();
  free(): void;
  get diagram_id(): string | undefined;
  set diagram_id(value: string | null | undefined);
  elements: DiagramElementType[];
  aliases: string[];
}
export class DiagramSpec {
  private constructor();
  free(): void;
  uuid: string;
  get description(): string | undefined;
  set description(value: string | null | undefined);
  get tags(): string[] | undefined;
  set tags(value: string[] | null | undefined);
  elements_specs: DiagramElementSpec[];
  shapes: Shape[];
  auto_layout_enabled: boolean;
  auto_layout_orientation: DiagramOrientation;
  auto_layout_only_straight_arrows: boolean;
}
export class DiagramsThemeSettings {
  private constructor();
  free(): void;
  get bg_color_diagram(): string | undefined;
  set bg_color_diagram(value: string | null | undefined);
  get text_color_legend_title(): string | undefined;
  set text_color_legend_title(value: string | null | undefined);
  get bg_color_person(): string | undefined;
  set bg_color_person(value: string | null | undefined);
  get bg_color_person_ext(): string | undefined;
  set bg_color_person_ext(value: string | null | undefined);
  get border_color_person(): string | undefined;
  set border_color_person(value: string | null | undefined);
  get border_color_person_ext(): string | undefined;
  set border_color_person_ext(value: string | null | undefined);
  get text_color_person(): string | undefined;
  set text_color_person(value: string | null | undefined);
  get text_color_person_ext(): string | undefined;
  set text_color_person_ext(value: string | null | undefined);
  get bg_color_software_system(): string | undefined;
  set bg_color_software_system(value: string | null | undefined);
  get bg_color_software_system_ext(): string | undefined;
  set bg_color_software_system_ext(value: string | null | undefined);
  get border_color_software_system(): string | undefined;
  set border_color_software_system(value: string | null | undefined);
  get border_color_software_system_ext(): string | undefined;
  set border_color_software_system_ext(value: string | null | undefined);
  get text_color_software_system(): string | undefined;
  set text_color_software_system(value: string | null | undefined);
  get text_color_software_system_ext(): string | undefined;
  set text_color_software_system_ext(value: string | null | undefined);
  get bg_color_container(): string | undefined;
  set bg_color_container(value: string | null | undefined);
  get bg_color_container_ext(): string | undefined;
  set bg_color_container_ext(value: string | null | undefined);
  get border_color_container(): string | undefined;
  set border_color_container(value: string | null | undefined);
  get border_color_container_ext(): string | undefined;
  set border_color_container_ext(value: string | null | undefined);
  get text_color_container(): string | undefined;
  set text_color_container(value: string | null | undefined);
  get text_color_container_ext(): string | undefined;
  set text_color_container_ext(value: string | null | undefined);
  get bg_color_component(): string | undefined;
  set bg_color_component(value: string | null | undefined);
  get bg_color_component_ext(): string | undefined;
  set bg_color_component_ext(value: string | null | undefined);
  get border_color_component(): string | undefined;
  set border_color_component(value: string | null | undefined);
  get border_color_component_ext(): string | undefined;
  set border_color_component_ext(value: string | null | undefined);
  get text_color_component(): string | undefined;
  set text_color_component(value: string | null | undefined);
  get text_color_component_ext(): string | undefined;
  set text_color_component_ext(value: string | null | undefined);
  get bg_color_boundary(): string | undefined;
  set bg_color_boundary(value: string | null | undefined);
  get border_color_boundary(): string | undefined;
  set border_color_boundary(value: string | null | undefined);
  get text_color_boundary(): string | undefined;
  set text_color_boundary(value: string | null | undefined);
  get bg_color_deployment_node(): string | undefined;
  set bg_color_deployment_node(value: string | null | undefined);
  get border_color_deployment_node(): string | undefined;
  set border_color_deployment_node(value: string | null | undefined);
  get text_color_deployment_node(): string | undefined;
  set text_color_deployment_node(value: string | null | undefined);
  get bg_color_relationship(): string | undefined;
  set bg_color_relationship(value: string | null | undefined);
  get line_color_relationship(): string | undefined;
  set line_color_relationship(value: string | null | undefined);
  get text_color_relationship(): string | undefined;
  set text_color_relationship(value: string | null | undefined);
}
export class ElementData {
  private constructor();
  free(): void;
  get position(): Point | undefined;
  set position(value: Point | null | undefined);
  get start(): Point | undefined;
  set start(value: Point | null | undefined);
  get end(): Point | undefined;
  set end(value: Point | null | undefined);
  get path(): Point[] | undefined;
  set path(value: Point[] | null | undefined);
  get svg_path(): string | undefined;
  set svg_path(value: string | null | undefined);
  get label_position(): Point | undefined;
  set label_position(value: Point | null | undefined);
}
export class IntoUnderlyingByteSource {
  private constructor();
  free(): void;
  start(controller: ReadableByteStreamController): void;
  pull(controller: ReadableByteStreamController): Promise<any>;
  cancel(): void;
  readonly type: string;
  readonly autoAllocateChunkSize: number;
}
export class IntoUnderlyingSink {
  private constructor();
  free(): void;
  write(chunk: any): Promise<any>;
  close(): Promise<any>;
  abort(reason: any): Promise<any>;
}
export class IntoUnderlyingSource {
  private constructor();
  free(): void;
  pull(controller: ReadableStreamDefaultController): Promise<any>;
  cancel(): void;
}
/**
 *
 * Error exposed to the front-end.
 * It can be created starting from other errors.
 */
export class MinaError {
  private constructor();
  free(): void;
  code: number;
  msg: string;
}
export class Person {
  private constructor();
  free(): void;
  base_data: BaseElement;
  get person_type(): PersonType | undefined;
  set person_type(value: PersonType | null | undefined);
}
export class Point {
  private constructor();
  free(): void;
  x: number;
  y: number;
}
export class Position {
  private constructor();
  free(): void;
  get left(): number | undefined;
  set left(value: number | null | undefined);
  get top(): number | undefined;
  set top(value: number | null | undefined);
  get z_index(): number | undefined;
  set z_index(value: number | null | undefined);
  get angle(): number | undefined;
  set angle(value: number | null | undefined);
}
export class Project {
  private constructor();
  free(): void;
  project_settings: ProjectSettings;
  project_library: ProjectLibrary;
}
export class ProjectLibrary {
  private constructor();
  free(): void;
  elements: C4Elements;
}
export class ProjectSettings {
  private constructor();
  free(): void;
  root: string;
  name: string;
  description: string;
  version: string;
  get ai_settings(): AISettings | undefined;
  set ai_settings(value: AISettings | null | undefined);
  autosave_enabled: boolean;
  get autosave_interval_seconds(): number | undefined;
  set autosave_interval_seconds(value: number | null | undefined);
  get themes_settings(): ThemesSettings | undefined;
  set themes_settings(value: ThemesSettings | null | undefined);
}
export class Relationship {
  private constructor();
  free(): void;
  base_data: BaseElement;
  get from(): string | undefined;
  set from(value: string | null | undefined);
  get to(): string | undefined;
  set to(value: string | null | undefined);
  get technology(): string | undefined;
  set technology(value: string | null | undefined);
  get relationship_type(): RelationshipType | undefined;
  set relationship_type(value: RelationshipType | null | undefined);
}
export class Shape {
  private constructor();
  free(): void;
  get shape_type(): ShapeType | undefined;
  set shape_type(value: ShapeType | null | undefined);
  get position(): Position | undefined;
  set position(value: Position | null | undefined);
  get size(): Size | undefined;
  set size(value: Size | null | undefined);
}
export class Size {
  private constructor();
  free(): void;
  get width(): number | undefined;
  set width(value: number | null | undefined);
  get height(): number | undefined;
  set height(value: number | null | undefined);
  get scale_x(): number | undefined;
  set scale_x(value: number | null | undefined);
  get scale_y(): number | undefined;
  set scale_y(value: number | null | undefined);
}
export class SoftwareSystem {
  private constructor();
  free(): void;
  base_data: BaseElement;
  get system_type(): SystemType | undefined;
  set system_type(value: SystemType | null | undefined);
}
export class ThemesSettings {
  private constructor();
  free(): void;
  get diagrams_theme_settings(): DiagramsThemeSettings | undefined;
  set diagrams_theme_settings(value: DiagramsThemeSettings | null | undefined);
}
