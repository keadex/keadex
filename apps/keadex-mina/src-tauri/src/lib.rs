pub mod controller;
pub mod core;
pub mod dao;
pub mod error_handling;
pub mod helper;
pub mod model;
pub mod parser;
// pub mod rendering_system; // Deprecated
#[cfg(feature = "desktop")]
pub mod repository;
#[cfg(feature = "desktop")]
pub mod service;
#[cfg(feature = "desktop")]
pub mod templates;
#[cfg(feature = "desktop")]
pub mod validator;
