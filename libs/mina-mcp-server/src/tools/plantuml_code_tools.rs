use crate::core::server::KeadexMinaServer;
use crate::models::requests::generate_plantuml_code_diagram_request::GeneratePlantUmlCodeDiagramRequest;
use crate::models::requests::generate_plantuml_code_elements_request::GeneratePlantUmlCodeElementsRequest;
use crate::models::requests::validate_plantuml_code_request::ValidatePlantUmlCodeRequest;
use keadex_mina::core::serializer::deserialize_plantuml_by_string;
use keadex_mina::model::diagram::diagram_plantuml::{
  DiagramPlantUML, PlantUMLSerializer, serialize_elements_to_plantuml,
};

pub async fn generate_plantuml_code_of_diagram_tool(
  _router: &KeadexMinaServer,
  request: GeneratePlantUmlCodeDiagramRequest,
) -> Result<String, String> {
  let mut diagram_plantuml = DiagramPlantUML::default();
  diagram_plantuml.diagram_id = request.diagram_id;
  diagram_plantuml.elements = request.diagram_elements;

  Ok(diagram_plantuml.serialize_to_plantuml(0))
}

pub async fn generate_plantuml_code_of_diagram_elements_tool(
  _router: &KeadexMinaServer,
  request: GeneratePlantUmlCodeElementsRequest,
) -> Result<String, String> {
  Ok(serialize_elements_to_plantuml(
    &request.diagram_elements,
    request.indentation.unwrap_or(0),
  ))
}

pub async fn validate_diagram_plantuml_code_tool(
  _router: &KeadexMinaServer,
  request: ValidatePlantUmlCodeRequest,
) -> Result<(), String> {
  // deserialize to check the given raw PlantUML has a valid syntax
  deserialize_plantuml_by_string(&request.plantuml_code)
    .map_err(|e| e.msg)
    .map(|_| ())
}
