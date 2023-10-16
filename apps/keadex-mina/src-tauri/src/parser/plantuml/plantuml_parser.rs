use pest_derive::Parser;

#[derive(Parser)]
#[grammar = "parser/plantuml/c4plantuml.pest"]
pub struct C4PlantUMLParser;
