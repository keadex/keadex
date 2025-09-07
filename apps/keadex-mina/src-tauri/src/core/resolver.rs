/*!
This module contains the logic to store/resolve modules can be shared across the app.
*/

#[cfg(desktop)]
use crate::api::filesystem::native_fs::NativeFileSystemAPI;
#[cfg(web)]
use crate::api::filesystem::web_fs::WebFileSystemAPI;
use crate::dao::filesystem::binary_dao::BinaryDAO as BinaryFsDAO;
use crate::dao::filesystem::diagram::diagram_plantuml_dao::DiagramPlantUMLDAO as DiagramPlantUMLFsDAO;
use crate::dao::filesystem::diagram::diagram_spec_dao::DiagramSpecDAO as DiagramSpecFsDAO;
use crate::dao::filesystem::library::component_dao::ComponentDAO as ComponentFsDAO;
use crate::dao::filesystem::library::container_dao::ContainerDAO as ContainerFsDAO;
use crate::dao::filesystem::library::person_dao::PersonDAO as PersonFsDAO;
use crate::dao::filesystem::library::software_system_dao::SoftwareSystemDAO as SoftwareSystemFsDAO;
use crate::dao::filesystem::project_settings_dao::ProjectSettingsDAO as ProjectSettingsFsDAO;
use crate::dao::inmemory::project_aliases_dao::ProjectAliasesDAO as ProjectAliasesIMDAO;
use crate::dao::inmemory::project_library_dao::ProejctLibraryDAO as ProjectLibraryIMDAO;
use crate::dao::inmemory::project_settings_dao::ProjectSettingsDAO as ProjectSettingsIMDAO;
use async_std::sync::RwLock;
use state::InitCell;
use std::collections::HashMap;

/**
Generic resolver which allows to safely share objects across the application.
*/
pub struct Resolver<T>
where
  T: Default + Send + Sync,
{
  obj: InitCell<RwLock<T>>,
}

impl<T> Default for Resolver<T>
where
  T: Default + Send + Sync,
{
  fn default() -> Self {
    let resolver = Resolver {
      obj: InitCell::new(),
    };
    resolver.obj.set(RwLock::new(T::default()));
    return resolver;
  }
}

impl<T> Resolver<T>
where
  T: Default + Send + Sync,
{
  pub fn resolve(&self) -> &InitCell<RwLock<T>> {
    return &self.obj;
  }
}

/**
Enum with a variant for each resolvable module. This enum can be used to resolve the modules.
*/
pub enum ResolvableModules {
  BinaryFsDAO(Resolver<BinaryFsDAO>),
  ProjectSettingsFsDAO(Resolver<ProjectSettingsFsDAO>),
  ProjectSettingsIMDAO(Resolver<ProjectSettingsIMDAO>),
  DiagramPlantUMLFsDAO(Resolver<DiagramPlantUMLFsDAO>),
  DiagramSpecFsDAO(Resolver<DiagramSpecFsDAO>),
  ContainerFsDAO(Resolver<ContainerFsDAO>),
  ComponentFsDAO(Resolver<ComponentFsDAO>),
  PersonFsDAO(Resolver<PersonFsDAO>),
  SoftwareSystemFsDAO(Resolver<SoftwareSystemFsDAO>),
  ProjectLibraryIMDAO(Resolver<ProjectLibraryIMDAO>),
  ProjectAliasesIMDAO(Resolver<ProjectAliasesIMDAO>),
  #[cfg(desktop)]
  FileSystemAPI(Resolver<NativeFileSystemAPI>),
  #[cfg(web)]
  FileSystemAPI(Resolver<WebFileSystemAPI>),
}

/**
The goal of the resolver is to let consumers construct components without having to know what their dependencies are.
The `Resolver` type wraps resolvers from other modules.
Private implementation details live on the wrapped resolvers.
Controllers, repositories and other modules are resolved from this `Resolver`.
*/
pub struct RootResolver {
  pub resolvers: HashMap<String, ResolvableModules>,
}

impl Default for RootResolver {
  fn default() -> Self {
    let mut resolvers = HashMap::new();
    resolvers.insert(
      stringify!(BinaryFsDAO).to_string(),
      ResolvableModules::BinaryFsDAO(Default::default()),
    );
    resolvers.insert(
      stringify!(ProjectSettingsFsDAO).to_string(),
      ResolvableModules::ProjectSettingsFsDAO(Default::default()),
    );
    resolvers.insert(
      stringify!(ProjectSettingsIMDAO).to_string(),
      ResolvableModules::ProjectSettingsIMDAO(Default::default()),
    );
    resolvers.insert(
      stringify!(DiagramPlantUMLFsDAO).to_string(),
      ResolvableModules::DiagramPlantUMLFsDAO(Default::default()),
    );
    resolvers.insert(
      stringify!(ContainerFsDAO).to_string(),
      ResolvableModules::ContainerFsDAO(Default::default()),
    );
    resolvers.insert(
      stringify!(ComponentFsDAO).to_string(),
      ResolvableModules::ComponentFsDAO(Default::default()),
    );
    resolvers.insert(
      stringify!(PersonFsDAO).to_string(),
      ResolvableModules::PersonFsDAO(Default::default()),
    );
    resolvers.insert(
      stringify!(SoftwareSystemFsDAO).to_string(),
      ResolvableModules::SoftwareSystemFsDAO(Default::default()),
    );
    resolvers.insert(
      stringify!(ProjectLibraryIMDAO).to_string(),
      ResolvableModules::ProjectLibraryIMDAO(Default::default()),
    );
    resolvers.insert(
      stringify!(ProjectAliasesIMDAO).to_string(),
      ResolvableModules::ProjectAliasesIMDAO(Default::default()),
    );
    resolvers.insert(
      stringify!(DiagramSpecFsDAO).to_string(),
      ResolvableModules::DiagramSpecFsDAO(Default::default()),
    );

    #[cfg(desktop)]
    {
      resolvers.insert(
        stringify!(FileSystemAPI).to_string(),
        ResolvableModules::FileSystemAPI(Default::default()),
      );
    }

    #[cfg(web)]
    {
      resolvers.insert(
        stringify!(FileSystemAPI).to_string(),
        ResolvableModules::FileSystemAPI(Default::default()),
      );
    }

    RootResolver { resolvers }
  }
}

/**
Macro which allows to resolve a module with read-only permissions.
# Arguments
  * `store` - Store where is stored the module
  * `module` - Module to resolve
*/
#[macro_export]
macro_rules! resolve_to_read {
  ($store: expr, $module: ident) => {{
    let target = $store.resolvers.get(stringify!($module)).unwrap();
    if let $module(value) = target {
      value.resolve().get().read().unwrap()
    } else {
      panic!("mismatch module when cast to {}", stringify!($pat));
    }
  }};
}

/**
Macro which allows to resolve a module with read and write permissions.
# Arguments
  * `store` - Store where is stored the module
  * `module` - Module to resolve
*/
#[macro_export]
macro_rules! resolve_to_write {
  ($store: expr, $module: ident) => {
    async {
      // let reff = $store; // Await the store
      let target = $store
        .resolvers
        .get(stringify!($module))
        .expect("Module not found");

      if let $module(value) = target {
        value.resolve().get().write().await
      } else {
        panic!("Mismatch module when casting to {}", stringify!($module));
      }
    }
  };
}
