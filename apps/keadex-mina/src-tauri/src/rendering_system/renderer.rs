/*!
Graph Renderer.
Module which exposes the functions to auto-generate the positions of all the elements of a diagram.
*/

use crate::helper::relationship_helper::generate_relationship_alias;
use crate::model::diagram::diagram_plantuml::DiagramElementType;
use crate::model::diagram::diagram_spec::DiagramOrientation;
use crate::model::graph::element_data::ElementData;
use crate::model::graph::node::{LinkGraph, NodePosition};
use crate::model::graph::node_handle::NodeHandle;
use crate::model::graph::point::Point;
use crate::model::graph::{edge::Edge, graph::Graph, node::Node};
use crate::rendering_system::graph_render_backend::GraphRenderBackend;
use crate::rendering_system::graph_render_backend::GRAPH_PADDING;
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
use std::cell::{BorrowMutError, RefCell, RefMut};
use std::collections::HashMap;
use std::rc::Rc;

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
    let result_positions = std::panic::catch_unwind(|| {
      let orientation = DiagramOrientation::to_layout_orientation(diagram_orientation);
      let (graph, all_nodes) = create_graph(elements, None, None);
      add_inter_graph_edges_to_graph(graph.clone(), &all_nodes, &mut vec![]);
      render_graph(&mut graph.borrow_mut(), orientation);
      let mut positions = adjust_graph_positions(
        &mut graph.borrow_mut(),
        ELEMENT_DEFAULT_LEFT,
        ELEMENT_DEFAULT_TOP,
      );
      let inter_graph_edges_position =
        generate_inter_graph_edges_positions(&mut graph.borrow_mut(), &positions);
      positions.extend(inter_graph_edges_position);

      return positions;
    });
    if let Ok(positions) = result_positions {
      return positions;
    } else {
      log::error!(
        "A panic occurred during the rendering of the diagram: {:?}",
        result_positions.unwrap_err()
      );
      return HashMap::<String, ElementData>::new();
    }
  } else {
    return HashMap::<String, ElementData>::new();
  }
}

/**
Creates a graph starting from an array of diagram elements.
# Arguments
  * `elements` - The elements of the diagram for which will be generated the graph.
  * `parent_graph_ref` - Reference to the parent graph (if any).
*/
pub fn create_graph(
  elements: &Vec<DiagramElementType>,
  parent_graph_ref: LinkGraph,
  parent_node_alias: Option<String>,
) -> (Rc<RefCell<Graph>>, HashMap<String, Node>) {
  let mut all_nodes = HashMap::<String, Node>::new();
  let mut nodes = HashMap::<String, Node>::new();
  let mut edges: Vec<Edge> = vec![];

  let graph = Rc::new(RefCell::new(Graph::new()));

  for element in elements {
    match element {
      DiagramElementType::Person(person) => {
        let node = Node::new(
          person.base_data.alias.as_ref().unwrap(),
          DiagramElementType::Person(person.clone()),
          None,
          None,
          parent_node_alias.clone(),
        );
        nodes.insert(
          String::from(person.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
        all_nodes.insert(
          String::from(person.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
      }
      DiagramElementType::SoftwareSystem(software_system) => {
        let node = Node::new(
          software_system.base_data.alias.as_ref().unwrap(),
          DiagramElementType::SoftwareSystem(software_system.clone()),
          None,
          None,
          parent_node_alias.clone(),
        );
        nodes.insert(
          String::from(software_system.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
        all_nodes.insert(
          String::from(software_system.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
      }
      DiagramElementType::Container(container) => {
        let node = Node::new(
          container.base_data.alias.as_ref().unwrap(),
          DiagramElementType::Container(container.clone()),
          None,
          None,
          parent_node_alias.clone(),
        );
        nodes.insert(
          String::from(container.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
        all_nodes.insert(
          String::from(container.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
      }
      DiagramElementType::Component(component) => {
        let node = Node::new(
          component.base_data.alias.as_ref().unwrap(),
          DiagramElementType::Component(component.clone()),
          None,
          None,
          parent_node_alias.clone(),
        );
        nodes.insert(
          String::from(component.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
        all_nodes.insert(
          String::from(component.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
      }
      DiagramElementType::Boundary(boundary) => {
        let subgraph = create_graph(
          &boundary.sub_elements,
          Some(graph.clone()),
          boundary.base_data.alias.clone(),
        );
        all_nodes.extend(subgraph.1);
        let node = Node::new(
          boundary.base_data.alias.as_ref().unwrap(),
          DiagramElementType::Boundary(boundary.clone()),
          Some(subgraph.0),
          parent_graph_ref.clone(),
          parent_node_alias.clone(),
        );
        nodes.insert(
          String::from(boundary.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
        all_nodes.insert(
          String::from(boundary.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
      }
      DiagramElementType::DeploymentNode(deployment_node) => {
        let subgraph = create_graph(
          &deployment_node.sub_elements,
          Some(graph.clone()),
          deployment_node.base_data.alias.clone(),
        );
        all_nodes.extend(subgraph.1);
        let node = Node::new(
          deployment_node.base_data.alias.as_ref().unwrap(),
          DiagramElementType::DeploymentNode(deployment_node.clone()),
          Some(subgraph.0),
          parent_graph_ref.clone(),
          parent_node_alias.clone(),
        );
        nodes.insert(
          String::from(deployment_node.base_data.alias.as_ref().unwrap()),
          node.clone(),
        );
        all_nodes.insert(
          String::from(deployment_node.base_data.alias.as_ref().unwrap()),
          node.clone(),
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
  graph.borrow_mut().nodes = nodes;
  graph.borrow_mut().edges = edges;
  return (graph, all_nodes);
}

/**
Stores into the given graph the inter-graph relationships (if any) and, if required, creates the
implicit relationships to connect inter-graph elements.
# Arguments
  * `graph` - Reference to the graph to update.
  * `all_nodes` - All nodes of the diagram.
*/
pub fn add_inter_graph_edges_to_graph(
  graph: Rc<RefCell<Graph>>,
  all_nodes: &HashMap<String, Node>,
  added_inter_graph_edges: &mut Vec<String>,
) {
  let mut graph_mut = graph.borrow_mut();
  let nodes_clone = graph_mut.nodes.clone();
  let nodes_aliases: Vec<&String> = nodes_clone.keys().collect();
  for node_alias in nodes_aliases {
    let node = graph_mut.nodes.get_mut(node_alias).unwrap();

    if let Some(subgraph_ref) = node.subgraph.as_mut() {
      // add the implicit relationships also for the subgraphs
      add_inter_graph_edges_to_graph(subgraph_ref.clone(), all_nodes, added_inter_graph_edges);
    }
  }

  let edges_clone = graph_mut.edges.clone();
  for edge in edges_clone {
    if all_nodes.contains_key(&edge.from)
      && all_nodes.contains_key(&edge.to)
      && (!graph_mut.nodes.contains_key(&edge.from) || !graph_mut.nodes.contains_key(&edge.to))
    {
      // In this case both the nodes exist in the entire diagram (there could be cases in which the user creates
      // a relationship between not existing nodes), and the edge could be potentially a inter-graph edge.
      let mut node_from = all_nodes.get(&edge.from);
      let mut node_to = all_nodes.get(&edge.to);
      let mut edge_alias = generate_relationship_alias(&edge.from, &edge.to);

      // First of all, store the potential inter-graph edge into the graph (it will be used
      // later to calculate its position since it will not be rendered with the "layout-rs" crate)
      graph_mut.inter_graph_edges.push(edge);

      let mut found = false;
      let mut reached_end = false;
      let mut parent_graph_from_mut: Option<Result<RefMut<Graph>, BorrowMutError>> = None;
      let mut parent_graph_to_mut: Option<Result<RefMut<Graph>, BorrowMutError>> = None;

      while !found && !reached_end {
        let mut parent_graph_from_mut_ref = None; // = &graph_mut;
        let mut parent_graph_to_mut_ref = None; // = &graph_mut;
        if parent_graph_from_mut.is_some() {
          if parent_graph_from_mut.as_ref().unwrap().is_ok() {
            parent_graph_from_mut_ref =
              Some(parent_graph_from_mut.as_mut().unwrap().as_mut().unwrap());
          }
        }
        if parent_graph_to_mut.is_some() {
          if parent_graph_to_mut.as_ref().unwrap().is_ok() {
            parent_graph_to_mut_ref = Some(parent_graph_to_mut.as_mut().unwrap().as_mut().unwrap());
          }
        }

        if parent_graph_from_mut_ref.is_none() && parent_graph_to_mut_ref.is_none() {
          // In this case both the parents are empty, which means both the nodes are children
          // of the same root graph
          if graph_mut.nodes.contains_key(&node_from.unwrap().alias)
            && graph_mut.nodes.contains_key(&node_to.unwrap().alias)
            && !added_inter_graph_edges.contains(&edge_alias)
          {
            found = true;
            // Add the implicit edge
            log::debug!(
              "Adding implicit edge between {:?} and {:?}: {:?}",
              &node_from.unwrap().alias,
              &node_to.unwrap().alias,
              edge_alias
            );

            added_inter_graph_edges.push(edge_alias.clone());
            graph_mut.edges.push(Edge::new(
              &edge_alias,
              &node_from.unwrap().alias,
              &node_to.unwrap().alias,
            ))
          }
        } else {
          // In this case just one of the two nodes do not have a parent or they both have a parent,
          // so use the root graph as the parent of the only node without parent (if any)
          if parent_graph_from_mut_ref.is_none() {
            parent_graph_from_mut_ref = Some(&mut graph_mut);
          } else if parent_graph_to_mut_ref.is_none() {
            parent_graph_to_mut_ref = Some(&mut graph_mut);
          }

          let parent_graph_from = parent_graph_from_mut_ref.unwrap();
          let parent_graph_to = parent_graph_to_mut_ref.unwrap();
          if parent_graph_from
            .nodes
            .contains_key(&node_from.unwrap().alias)
            && parent_graph_from
              .nodes
              .contains_key(&node_to.unwrap().alias)
            && parent_graph_to
              .nodes
              .contains_key(&node_from.unwrap().alias)
            && parent_graph_to.nodes.contains_key(&node_to.unwrap().alias)
            && !added_inter_graph_edges.contains(&edge_alias)
          {
            found = true;
            // Add the implicit edge
            log::debug!(
              "Adding implicit edge between {:?} and {:?}: {:?}",
              &node_from.unwrap().alias,
              &node_to.unwrap().alias,
              edge_alias
            );

            added_inter_graph_edges.push(edge_alias.clone());

            // Both the nodes are part of the same parent, so we can use "parent_graph_from" or "parent_graph_to"
            // to add the edge
            parent_graph_from.edges.push(Edge::new(
              &edge_alias,
              &node_from.unwrap().alias,
              &node_to.unwrap().alias,
            ))
          }
        }

        if !found {
          reached_end = true;

          // Update the starting node
          let parent_node_alias_from = node_from.unwrap().parent_node_alias.clone();
          if parent_node_alias_from.is_some() {
            node_from = all_nodes.get(&parent_node_alias_from.unwrap());
            if node_from.unwrap().parent_graph.as_ref().is_some() {
              parent_graph_from_mut = Some(
                node_from
                  .as_ref()
                  .unwrap()
                  .parent_graph
                  .as_ref()
                  .unwrap()
                  .try_borrow_mut(),
              );
            } else {
              parent_graph_from_mut = None;
            }
            reached_end = false;
          }

          // Update the ending node
          let parent_node_alias_to = node_to.unwrap().parent_node_alias.clone();
          if parent_node_alias_to.is_some() {
            node_to = all_nodes.get(&parent_node_alias_to.unwrap());
            if node_to.unwrap().parent_graph.as_ref().is_some() {
              parent_graph_to_mut = Some(
                node_to
                  .as_ref()
                  .unwrap()
                  .parent_graph
                  .as_ref()
                  .unwrap()
                  .try_borrow_mut(),
              );
            } else {
              parent_graph_to_mut = None;
            }
            reached_end = false;
          }

          // Update the edge alias
          edge_alias =
            generate_relationship_alias(&node_from.unwrap().alias, &node_to.unwrap().alias);
        }
      }
    }
  }
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
Renders a graph by using the [layout](https://github.com/nadavrot/layout) crate and stores the
result of the rendering (render backend) into the graph.
# Arguments
  * `graph` - Reference of the graph to render.
*/
pub fn render_graph(graph: &mut RefMut<Graph>, orientation: Orientation) {
  if graph.nodes.len() > 0 {
    let mut visual_graph: VisualGraph = VisualGraph::new(orientation);

    // Adding nodes to the visual graph
    let nodes_clone = graph.nodes.clone();
    let nodes_aliases: Vec<&String> = nodes_clone.keys().collect();
    for node_alias in nodes_aliases {
      let node = graph.nodes.get_mut(node_alias).unwrap();

      // Render the subgraph, if any
      let mut size_subgraph = None;
      if let Some(subgraph_ref) = node.subgraph.as_mut() {
        render_graph(&mut subgraph_ref.borrow_mut(), orientation);
        if let Some(subgraph_render_backend) = &subgraph_ref.borrow_mut().graph_render_backend {
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
    for edge in graph.edges.clone() {
      // Since the user could potentially write PlantUML code of relationships between not existing
      // elements, we have to check that they actually exist. There could be also cases of inter-graph
      // relationships (so starting and ending node could not be part of the same graph)
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
}

/**
Adjusts the positions of all the elements of a graph by considering the given offsets.
# Arguments
  * `graph` - Graph to update.
  * `offset_x` - Offset X.
  * `offset_y` - Offset Y.
*/
pub fn adjust_graph_positions(
  graph: &mut Graph,
  offset_x: f64,
  offset_y: f64,
) -> HashMap<String, ElementData> {
  let mut updated_positions = HashMap::new();

  if let Some(graph_render_backend) = graph.graph_render_backend.as_mut() {
    graph_render_backend.adjust_positions(offset_x, offset_y);
    updated_positions.extend(graph_render_backend.elements.clone());
  }

  let nodes_clone = graph.nodes.clone();
  let nodes_aliases: Vec<&String> = nodes_clone.keys().collect();
  for node_alias in nodes_aliases {
    let parent_node = graph.nodes.get_mut(node_alias).unwrap();
    let parent_node_position = updated_positions
      .get(&parent_node.alias)
      .unwrap()
      .position
      .unwrap();
    if let Some(subgraph_ref) = parent_node.subgraph.as_mut() {
      let mut subgraph = subgraph_ref.borrow_mut();
      let mut subgraph_position = Point::new(0.0, 0.0);
      if let Some(subgraph_render_backend) = subgraph.graph_render_backend.as_ref() {
        subgraph_position = Point::new(subgraph_render_backend.x, subgraph_render_backend.y);
      }

      // Before aligning the subgraph elements offsets to the parent node position, we need to remove
      // the auto offset (subgraph_position.x and subgraph_position.y) applied by the "layout-rs" crate
      // when rendering the subgraph (there could be cases in which the subgraph is not rendered at the [0,0] position).
      // We need also to remove the GRAPH_PADDING constant added by the graph_render_backend.adjust_positions() function.
      // In this way we'll start to add the new offset (which is the position of the parent node + the container padding)
      // starting from the [0,0] position.
      updated_positions.extend(adjust_graph_positions(
        &mut subgraph,
        -subgraph_position.x
          + GRAPH_PADDING
          + parent_node_position.x
          + BASE_ELASTIC_CONTAINER_PADDING_BOX,
        -subgraph_position.y
          + GRAPH_PADDING
          + parent_node_position.y
          + BASE_ELASTIC_CONTAINER_PADDING_BOX,
      ));
    }
  }
  return updated_positions;
}

/**
Generates the positions of the inter-graph edges that cannot be generated during the rendering
of each graph/subgraph composing a diagram.
# Arguments
  * `graph` - Reference of the graph.
  * `positions` - Positions generated during the rendering of each graph/subgraph.
*/
pub fn generate_inter_graph_edges_positions(
  graph: &mut Graph,
  positions: &HashMap<String, ElementData>,
) -> HashMap<String, ElementData> {
  let mut inter_graph_edges_positions = HashMap::new();

  let inter_graph_edges_clone = graph.inter_graph_edges.clone();
  for inter_graph_edge in inter_graph_edges_clone {
    if positions.contains_key(&inter_graph_edge.from)
      && positions.contains_key(&inter_graph_edge.to)
    {
      let node_from = positions.get_key_value(&inter_graph_edge.from).unwrap().1;
      let node_to = positions.get_key_value(&inter_graph_edge.to).unwrap().1;

      let edge_positions = adjust_inter_graph_edge_points_positions(
        node_from.position.unwrap(),
        node_from.size.unwrap(),
        node_to.position.unwrap(),
        node_to.size.unwrap(),
      );
      inter_graph_edges_positions.insert(
        inter_graph_edge.alias,
        ElementData::new(None, Some(edge_positions.0), Some(edge_positions.1), None),
      );
    }
  }

  let nodes_clone = graph.nodes.clone();
  let nodes_aliases: Vec<&String> = nodes_clone.keys().collect();
  for node_alias in nodes_aliases {
    let node = graph.nodes.get_mut(node_alias).unwrap();
    if let Some(subgraph_ref) = node.subgraph.as_mut() {
      let mut subgraph = subgraph_ref.borrow_mut();
      inter_graph_edges_positions.extend(generate_inter_graph_edges_positions(
        &mut subgraph,
        positions,
      ));
    }
  }

  return inter_graph_edges_positions;
}

/**
Adjusts the positions of the starting and ending points of a inter-graph edge
in order to render a more clear arrow between two nodes.
Returns the adjusted positions.
# Arguments
  * `node_position_from` - Position of the starting node.
  * `node_size_from` - Size of the starting node.
  * `node_position_to` - Position of the ending node.
  * `node_size_to` - Size of the ending node.
*/
pub fn adjust_inter_graph_edge_points_positions(
  node_position_from: Point,
  node_size_from: Point,
  node_position_to: Point,
  node_size_to: Point,
) -> (Point, Point) {
  const MIN_DELTA_X: f64 = BOX_WIDTH;
  const MIN_DELTA_Y: f64 = BOX_MIN_HEIGHT;

  let mut rel_position_from = Point::new(node_position_from.x, node_position_from.y);
  let mut rel_position_to = Point::new(node_position_to.x, node_position_to.y);

  let position_to;

  if (node_position_to.x >= node_position_from.x
    && node_position_to.x < (node_position_from.x + node_size_from.x + MIN_DELTA_X))
    || (node_position_to.x <= node_position_from.x
      && node_position_from.x < (node_position_to.x + node_size_to.x + MIN_DELTA_X))
  {
    if node_position_from.y > (node_position_to.y + node_size_to.y + MIN_DELTA_Y) {
      position_to = NodePosition::Top;
    } else if node_position_to.y > (node_position_from.y + node_size_from.y + MIN_DELTA_Y) {
      position_to = NodePosition::Bottom;
    } else {
      position_to = NodePosition::Center;
    }
  } else if node_position_to.x >= (node_position_from.x + node_size_from.x + MIN_DELTA_X) {
    if node_position_from.y > (node_position_to.y + node_size_to.y + MIN_DELTA_Y) {
      position_to = NodePosition::TopRight;
    } else if node_position_to.y > (node_position_from.y + node_size_from.y + MIN_DELTA_Y) {
      position_to = NodePosition::BottomRight;
    } else {
      position_to = NodePosition::Right;
    }
  } else {
    if node_position_from.y > (node_position_to.y + node_size_to.y + MIN_DELTA_Y) {
      position_to = NodePosition::TopLeft;
    } else if node_position_to.y > (node_position_from.y + node_size_from.y + MIN_DELTA_Y) {
      position_to = NodePosition::BottomLeft;
    } else {
      position_to = NodePosition::Left;
    }
  }

  match position_to {
    NodePosition::Top => {
      rel_position_from.x = node_position_from.x + node_size_from.x / 2.0;
      rel_position_from.y = node_position_from.y;
      rel_position_to.x = node_position_to.x + node_size_to.x / 2.0;
      rel_position_to.y = node_position_to.y + node_size_to.y;
    }
    NodePosition::TopRight | NodePosition::Right | NodePosition::BottomRight => {
      rel_position_from.x = node_position_from.x + node_size_from.x;
      rel_position_from.y = node_position_from.y + node_size_from.y / 2.0;
      rel_position_to.x = node_position_to.x;
      rel_position_to.y = node_position_to.y + node_size_to.y / 2.0;
    }
    NodePosition::Bottom => {
      rel_position_from.x = node_position_from.x + node_size_from.x / 2.0;
      rel_position_from.y = node_position_from.y + node_size_from.y;
      rel_position_to.x = node_position_to.x + node_size_to.x / 2.0;
      rel_position_to.y = node_position_to.y;
    }
    NodePosition::BottomLeft | NodePosition::Left | NodePosition::TopLeft => {
      rel_position_from.x = node_position_from.x;
      rel_position_from.y = node_position_from.y + node_size_from.y / 2.0;
      rel_position_to.x = node_position_to.x + node_size_to.x;
      rel_position_to.y = node_position_to.y + node_size_to.y / 2.0;
    }
    NodePosition::Center => {
      // This case should not possible, so leave the positions as-is
    }
  }

  return (rel_position_from, rel_position_to);
}
