use crate::model::diagram::Diagram;
use crate::model::diagram::DiagramType;

pub struct LoadProjectAliasesOpts {
  pub skip_lib_aliases: bool,
  pub skip_diagram_aliases: bool,
  pub only_diagram: Option<Diagram>,
}

impl LoadProjectAliasesOpts {
  pub fn new(
    skip_lib_aliases: bool,
    skip_diagram_aliases: bool,
    only_diagram_name: Option<&str>,
    only_diagram_type: Option<DiagramType>,
  ) -> Self {
    let only_diagram = match (only_diagram_name, only_diagram_type) {
      (Some(name), Some(diagram_type)) => Some(Diagram {
        diagram_name: Some(name.to_string()),
        diagram_type: Some(diagram_type),
        ..Default::default()
      }),
      _ => None,
    };
    LoadProjectAliasesOpts {
      skip_lib_aliases,
      skip_diagram_aliases,
      only_diagram,
    }
  }
}

impl Default for LoadProjectAliasesOpts {
  fn default() -> Self {
    LoadProjectAliasesOpts {
      skip_lib_aliases: false,
      skip_diagram_aliases: false,
      only_diagram: None,
    }
  }
}
