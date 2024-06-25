use crate::model::diagram::diagram_plantuml::DiagramElementType;
use crate::model::diagram::diagram_spec::DiagramOrientation;
use crate::model::graph::element_data::ElementData;
use crate::model::graph::node_handle::NodeHandle;
use crate::model::graph::point::Point;
use crate::model::graph::{edge::Edge, graph::Graph, node::Node};
use crate::rendering_system::graph_render_backend::GraphRenderBackend;
use crate::rendering_system::style_constants::{
  BASE_ELASTIC_CONTAINER_FOOTER_HEIGHT, BASE_ELASTIC_CONTAINER_MIN_HEIGHT,
  BASE_ELASTIC_CONTAINER_MIN_WIDTH, BASE_ELASTIC_CONTAINER_PADDING_BOX,
  BASE_ELASTIC_CONTAINER_PADDING_FOOTER, BOX_MIN_HEIGHT, BOX_WIDTH, ELEMENT_BORDER_WIDTH,
  ELEMENT_DEFAULT_LEFT, ELEMENT_DEFAULT_TOP, PERSON_HEAD_RADIUS,
};
use layout::{
  adt::dag::NodeHandle as LayoutNodeHandle,
  core::{
    base::Orientation,
    geometry::Point as LayoutPoint,
    style::{LineStyleKind, StyleAttr},
  },
  std_shapes::shapes::{Arrow, Element, LineEndKind, ShapeKind},
  topo::layout::VisualGraph,
};
use std::borrow::BorrowMut;
use std::collections::HashMap;

/**
Generates the positions of the diagram elements to lay out the diagram automatically.
Returns a map, where the key is the alias of the diagram element and the value its position.
# Arguments
  * `elements` - The elements of the diagram for which will be generated the positions.
*/
pub fn generate_positions(
  elements: &Vec<DiagramElementType>,
  diagram_orientation: &DiagramOrientation,
) -> HashMap<String, ElementData> {
  if elements.len() > 0 {
    let orientation = DiagramOrientation::to_layout_orientation(diagram_orientation);
    let mut graph = create_graph(elements);
    let mut rendered_graph = render_graph(&mut graph, orientation);
    let positions = recalculate_positions(
      &mut rendered_graph,
      ELEMENT_DEFAULT_LEFT,
      ELEMENT_DEFAULT_TOP,
    );
    return positions;
  } else {
    return HashMap::<String, ElementData>::new();
  }
}

/**
Creates a graph starting from an array of diagram elements.
# Arguments
  * `elements` - The elements of the diagram for which will be generated the graph.
*/
pub fn create_graph(elements: &Vec<DiagramElementType>) -> Graph {
  let mut nodes = HashMap::<String, Node>::new();
  let mut edges: Vec<Edge> = vec![];
  for element in elements {
    match element {
      DiagramElementType::Person(person) => {
        nodes.insert(
          String::from(person.base_data.alias.as_ref().unwrap()),
          Node::new(
            person.base_data.alias.as_ref().unwrap(),
            DiagramElementType::Person(person.clone()),
            None,
          ),
        );
      }
      DiagramElementType::SoftwareSystem(software_system) => {
        nodes.insert(
          String::from(software_system.base_data.alias.as_ref().unwrap()),
          Node::new(
            software_system.base_data.alias.as_ref().unwrap(),
            DiagramElementType::SoftwareSystem(software_system.clone()),
            None,
          ),
        );
      }
      DiagramElementType::Container(container) => {
        nodes.insert(
          String::from(container.base_data.alias.as_ref().unwrap()),
          Node::new(
            container.base_data.alias.as_ref().unwrap(),
            DiagramElementType::Container(container.clone()),
            None,
          ),
        );
      }
      DiagramElementType::Component(component) => {
        nodes.insert(
          String::from(component.base_data.alias.as_ref().unwrap()),
          Node::new(
            component.base_data.alias.as_ref().unwrap(),
            DiagramElementType::Component(component.clone()),
            None,
          ),
        );
      }
      DiagramElementType::Boundary(boundary) => {
        let subgraph = create_graph(&boundary.sub_elements);
        nodes.insert(
          String::from(boundary.base_data.alias.as_ref().unwrap()),
          Node::new(
            boundary.base_data.alias.as_ref().unwrap(),
            DiagramElementType::Boundary(boundary.clone()),
            Some(subgraph),
          ),
        );
      }
      DiagramElementType::DeploymentNode(deployment_node) => {
        let subgraph = create_graph(&deployment_node.sub_elements);
        nodes.insert(
          String::from(deployment_node.base_data.alias.as_ref().unwrap()),
          Node::new(
            deployment_node.base_data.alias.as_ref().unwrap(),
            DiagramElementType::DeploymentNode(deployment_node.clone()),
            Some(subgraph),
          ),
        );
      }
      DiagramElementType::Relationship(relationship) => edges.push(Edge::new(
        relationship.base_data.alias.as_ref().unwrap(),
        relationship.from.as_ref().unwrap(),
        relationship.to.as_ref().unwrap(),
      )),
      _ => {}
    }
  }
  return Graph::new(nodes, edges);
}

/**
Returns the size of the node according to the diagram element type.
# Arguments
  * `element_type` - Type of the diagram element representing the node.
*/
pub fn get_node_size_from_element_type(element_type: &DiagramElementType) -> LayoutPoint {
  let default_size = LayoutPoint::new(100.0, 100.0);
  let person_size = LayoutPoint::new(BOX_WIDTH, BOX_MIN_HEIGHT + PERSON_HEAD_RADIUS * 2.0);
  let box_size = LayoutPoint::new(BOX_WIDTH, BOX_MIN_HEIGHT);
  let elastic_container_size = LayoutPoint::new(
    BASE_ELASTIC_CONTAINER_MIN_WIDTH + ELEMENT_BORDER_WIDTH,
    BASE_ELASTIC_CONTAINER_MIN_HEIGHT + BASE_ELASTIC_CONTAINER_FOOTER_HEIGHT + ELEMENT_BORDER_WIDTH,
  );

  // "Include" and "Comment" elements are ignored since they are not added in the graph.
  // "Relationship" elements are ignored since they are added as edges.
  match element_type {
    DiagramElementType::Person(_) => return person_size,
    DiagramElementType::SoftwareSystem(_) => return box_size,
    DiagramElementType::Container(_) => return box_size,
    DiagramElementType::Component(_) => return box_size,
    DiagramElementType::Boundary(_) => return elastic_container_size,
    DiagramElementType::DeploymentNode(_) => return elastic_container_size,
    _ => return default_size,
  }
}

/**
Creates a node with the given label and size, and adds it to the graph.
# Arguments
  * `graph` - Graph where the node will be added.
  * `label` - Label of the node.
  * `raw_size` - Size of the node.
*/
pub fn add_node(
  graph: &mut VisualGraph,
  label: &str,
  element_type: &DiagramElementType,
  raw_size: Option<Point>,
  orientation: Orientation,
) -> NodeHandle {
  let mut size = get_node_size_from_element_type(element_type);
  if let Some(raw_size) = raw_size {
    size.x = raw_size.x;
    size.y = raw_size.y;
  }
  let node: Element = Element::create(
    ShapeKind::new_box(label),
    StyleAttr::simple(),
    orientation,
    size,
  );

  let handle: NodeHandle = NodeHandle::from(graph.add_node(node));
  return handle;
}

/**
Creates a relationship between two nodes, with the given label, and adds it to the graph.
# Arguments
  * `graph` - Graph where the relationship will be added.
  * `label` - Label of the relationship.
  * `from` - Starting node.
  * `to` - Ending node.
*/
pub fn add_rel(graph: &mut VisualGraph, label: &str, from: NodeHandle, to: NodeHandle) {
  graph.add_edge(
    Arrow::new(
      LineEndKind::Arrow,
      LineEndKind::None,
      LineStyleKind::Dashed,
      label,
      &StyleAttr::simple(),
      &None,
      &None,
    ),
    LayoutNodeHandle::new(from.idx),
    LayoutNodeHandle::new(to.idx),
  );
}

/**
Renders a graph by using the [layout](https://github.com/nadavrot/layout) crate.
# Arguments
  * `graph` - Graph to render.
*/
pub fn render_graph(graph: &mut Graph, orientation: Orientation) -> Graph {
  if graph.nodes.len() > 0 {
    let mut visual_graph: VisualGraph = VisualGraph::new(orientation);

    // Adding nodes to the visual graph
    let nodes_clone = graph.nodes.clone();
    let nodes_aliases: Vec<&String> = nodes_clone.keys().collect();
    for node_alias in nodes_aliases {
      let node = graph.nodes.get_mut(node_alias).unwrap();

      // Render the subgraph, if any
      let mut size_subgraph = None;
      if let Some(subgraph) = node.subgraph.borrow_mut() {
        let rendered_subgraph = render_graph(subgraph, orientation);
        if let Some(subgraph_render_backend) = rendered_subgraph.graph_render_backend {
          size_subgraph = Some(Point::new(
            subgraph_render_backend.get_width()
              + ELEMENT_BORDER_WIDTH
              + BASE_ELASTIC_CONTAINER_PADDING_BOX * 2.0,
            subgraph_render_backend.get_height()
              + BASE_ELASTIC_CONTAINER_FOOTER_HEIGHT
              + ELEMENT_BORDER_WIDTH
              + BASE_ELASTIC_CONTAINER_PADDING_BOX * 2.0
              + BASE_ELASTIC_CONTAINER_PADDING_FOOTER,
          ))
        }
      }

      let handle = add_node(
        &mut visual_graph,
        &node.alias,
        &node.element_type,
        size_subgraph,
        orientation,
      );
      graph.nodes.get_mut(node_alias).unwrap().handle = Some(handle);
    }

    // Adding relationships to the visual graph
    for edge in &graph.edges {
      // Since the user could potentially write PlantUML code of relationships between not existing
      // elements, we have to check that they actually exist.
      if graph.nodes.contains_key(&edge.from) && graph.nodes.contains_key(&edge.to) {
        add_rel(
          &mut visual_graph,
          &edge.alias,
          graph
            .nodes
            .get_key_value(&edge.from)
            .unwrap()
            .1
            .handle
            .unwrap(),
          graph
            .nodes
            .get_key_value(&edge.to)
            .unwrap()
            .1
            .handle
            .unwrap(),
        );
      }
    }

    let mut graph_render_backend = GraphRenderBackend::default();
    visual_graph.do_it(false, false, false, &mut graph_render_backend);
    graph.graph_render_backend = Some(graph_render_backend);
  }
  return graph.clone();
}

/**
Recalculates the positions of all the elements of a graph by considering the given offsets.
# Arguments
  * `graph` - Graph to update.
  * `offset_x` - Offset X.
  * `offset_y` - Offset Y.
*/
pub fn recalculate_positions(
  graph: &mut Graph,
  offset_x: f64,
  offset_y: f64,
) -> HashMap<String, ElementData> {
  let mut updated_positions = HashMap::new();

  if let Some(graph_render_backend) = graph.graph_render_backend.borrow_mut() {
    graph_render_backend.recalculate_positions(offset_x, offset_y);
    updated_positions.extend(graph_render_backend.elements.clone());
  }

  let nodes_clone = graph.nodes.clone();
  let nodes_aliases: Vec<&String> = nodes_clone.keys().collect();
  for node_alias in nodes_aliases {
    let node = graph.nodes.get_mut(node_alias).unwrap();
    let node_position = updated_positions
      .get(&node.alias)
      .unwrap()
      .position
      .unwrap();
    if let Some(subgraph) = node.subgraph.borrow_mut() {
      // recalculate_positions(subgraph, node_position.x, node_position.y);
      updated_positions.extend(recalculate_positions(
        subgraph,
        node_position.x + BASE_ELASTIC_CONTAINER_PADDING_BOX,
        node_position.y + BASE_ELASTIC_CONTAINER_PADDING_BOX,
      ));
    }
  }
  return updated_positions;
}
