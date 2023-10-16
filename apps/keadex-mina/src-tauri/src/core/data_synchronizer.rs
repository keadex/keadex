// /*!
// Data Synchronizer.
// Synchronizes data between file system (project's files) and local state (Mina's in-memory state).
// */
// use crate::core::serializer::deserialize_by_path;
// use crate::model::c4_element::component;
// use crate::model::project_settings;
// use crate::model::project_settings::ProjectSettings;
// use fs2::FileExt;
// use notify::{watcher, DebouncedEvent, RecursiveMode, Watcher};
// use std::collections::HashMap;
// use std::fs::{File, OpenOptions};
// use std::io::BufReader;
// use std::path::Path;
// use std::sync::mpsc::channel;
// use std::sync::{Arc, Mutex};
// use std::thread;
// use std::time::Duration;
// use walkdir::{DirEntry, WalkDir};

// pub struct DataSynchronizer {
//   is_running_path: Arc<Mutex<HashMap<String, bool>>>,
// }

// impl Default for DataSynchronizer {
//   fn default() -> Self {
//     DataSynchronizer {
//       is_running_path: Arc::new(Mutex::new(HashMap::new())),
//     }
//   }
// }

// impl DataSynchronizer {
//   pub fn start_synchronization(&mut self, path: String) {
//     log::debug!("Start synchronization");
//     let is_running_path_arc = Arc::clone(&self.is_running_path);
//     let mut is_running_path = is_running_path_arc.lock().unwrap();
//     (*is_running_path).insert(path.clone(), true);
//     let is_running_path_arc_t = Arc::clone(&self.is_running_path);
//     let path_arc_t = Arc::new(Mutex::new(path.clone()));
//     thread::spawn(move || {
//       // let file = File::open("C:\\Users\\Jack\\Documents\\Progetti\\Keadex\\SourceCode\\web-apps\\apps\\keadex-mina\\test-mina-project\\mina.json").unwrap();
//       // file.lock_exclusive();
//       let files = lock_project_files(&path);
//       let (tx, rx) = channel();
//       let mut watcher = watcher(tx, Duration::from_secs(10)).unwrap();
//       watcher.watch(&path, RecursiveMode::Recursive).unwrap();
//       loop {
//         let is_running_path = is_running_path_arc_t.lock().unwrap();
//         if !*is_running_path.get(&path).unwrap() {
//           break;
//         }
//         drop(is_running_path);
//         let path_t = path_arc_t.lock().unwrap();
//         match rx.recv() {
//           Ok(event) => on_path_event((*path_t).clone(), event),
//           Err(e) => log::error!("Watch error: {:?}", e),
//         }
//         drop(path_t);
//       }
//     });
//   }

//   pub fn stop_synchronization(&mut self, path: String) {
//     log::debug!("Stop synchronization");
//     let is_running_path_arc = Arc::clone(&self.is_running_path);
//     let mut is_running_path = is_running_path_arc.lock().unwrap();
//     (*is_running_path).insert(path.clone(), false);
//   }
// }

// fn on_path_event(path: String, event: DebouncedEvent) {
//   match event {
//     DebouncedEvent::Write(ref path_buf) => update_state(path_buf.as_path(), &event),
//     DebouncedEvent::Create(ref path_buf) => update_state(path_buf.as_path(), &event),
//     _ => {}
//   }
// }

// fn is_project_file(entry: &DirEntry) -> bool {
//   let path = entry.path().to_str().unwrap();
//   path.ends_with(".json") || path.ends_with(".puml")
// }

// fn lock_project_files(path: &String) -> Vec<File> {
//   let mut files: Vec<File> = Vec::new();
//   WalkDir::new("C:\\Users\\Jack\\Documents\\Progetti\\Keadex\\SourceCode\\web-apps\\apps\\keadex-mina\\test-mina-project")
//     .into_iter()
//     .filter_map(|v| v.ok())
//     .filter(|x| is_project_file(&x))
//     .for_each(|x| {
//       files.push(lock_file(x.path().to_str().unwrap()));
//       ()
//     });
//   files
//   //
//   // for x in result {
//   //   println!("{}", x)
//   // }
//   // let array:[i32; 4] = [1,2,3,4];
//   // let result = array.map(|num| num.to_string());
//   // for x in result {
//   //   println!("{}", x);
//   // }
// }

// fn lock_file(path: &str) -> File {
//   println!("{}", path);
//   let file = OpenOptions::new()
//     .read(true)
//     .write(true)
//     .append(true)
//     .open(path)
//     .unwrap();
//   file.lock_exclusive();
//   file
// }

// fn update_state(path: &Path, event: &DebouncedEvent) {
//   let filename = path.file_stem().unwrap().to_str().unwrap();
//   let project_settings: ProjectSettings = deserialize_by_path(path);
//   log::debug!("settings {:?}", project_settings);
//   match filename {
//     component::NAME => println!("0"),
//     project_settings::NAME => println!("0"),
//     _ => log::error!("Object {:?} not supported", filename),
//   }
// }
