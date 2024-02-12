pub mod filesystem;
#[cfg(feature = "desktop")]
pub mod inmemory;

/**
Generic DAO interface
*/
#[cfg(feature = "desktop")]
pub trait DAO {}
