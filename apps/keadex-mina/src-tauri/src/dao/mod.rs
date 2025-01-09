pub mod filesystem;
#[cfg(cross)]
pub mod inmemory;

/**
Generic DAO interface
*/
#[cfg(cross)]
pub trait DAO {}
