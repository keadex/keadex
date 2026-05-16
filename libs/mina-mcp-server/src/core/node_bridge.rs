use serde_json::{Value, json};
use std::collections::HashMap;
use std::env::current_exe;
use std::io::{BufRead, BufReader, Write};
use std::process::{Child, ChildStdin, Command, Stdio};
use std::sync::OnceLock;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use tokio::sync::oneshot;

static NODE_BRIDGE: OnceLock<Arc<NodeBridge>> = OnceLock::new();

pub struct NodeBridge {
  stdin: Mutex<ChildStdin>,
  _child: Mutex<Child>,
  pending: Arc<Mutex<HashMap<u64, oneshot::Sender<Value>>>>,
  counter: AtomicU64,
}

impl NodeBridge {
  pub fn init() {
    NODE_BRIDGE.get_or_init(|| NodeBridge::new());
  }

  pub fn global() -> &'static NodeBridge {
    NODE_BRIDGE
      .get()
      .expect("NodeBridge not initialized. Call NodeBridge::init() first.")
  }

  pub fn new() -> Arc<Self> {
    let bridge_script = current_exe().unwrap().parent().unwrap().join("mina.js");
    let mut child = Command::new("node")
      .arg(bridge_script)
      .stdin(Stdio::piped())
      .stdout(Stdio::piped())
      .stderr(Stdio::inherit())
      .spawn()
      .expect("Failed to spawn Node.js bridge");

    let stdin = child.stdin.take().unwrap();
    let stdout = child.stdout.take().unwrap();

    let pending: Arc<Mutex<HashMap<u64, oneshot::Sender<Value>>>> =
      Arc::new(Mutex::new(HashMap::new()));

    let bridge = Arc::new(Self {
      stdin: Mutex::new(stdin),
      _child: Mutex::new(child),
      pending: Arc::clone(&pending),
      counter: AtomicU64::new(0),
    });

    // Background thread: reads responses from Node.js
    let pending_clone = Arc::clone(&pending);
    std::thread::spawn(move || {
      let reader = BufReader::new(stdout);
      for line in reader.lines() {
        if let Ok(line) = line {
          if let Ok(resp) = serde_json::from_str::<Value>(&line) {
            let id = resp["id"].as_u64().unwrap();
            if let Some(tx) = pending_clone.lock().unwrap().remove(&id) {
              let _ = tx.send(resp);
            }
          }
        }
      }
    });

    bridge
  }

  pub async fn call(&self, fn_name: &str, args: Value) -> Result<Value, String> {
    let id = self.counter.fetch_add(1, Ordering::SeqCst);
    let (tx, rx) = oneshot::channel();

    // Register the pending request
    self.pending.lock().unwrap().insert(id, tx);

    // Send request to Node.js
    let msg = json!({ "id": id, "fn": fn_name, "args": args }).to_string();
    {
      let mut stdin = self.stdin.lock().unwrap();
      writeln!(stdin, "{}", msg).map_err(|e| e.to_string())?;
    }

    // Wait for the response
    let resp = rx.await.map_err(|e| e.to_string())?;

    if resp["ok"].as_bool().unwrap_or(false) {
      Ok(resp["result"].clone())
    } else {
      Err(
        resp["error"]
          .as_str()
          .unwrap_or("unknown error")
          .to_string(),
      )
    }
  }
}

impl Drop for NodeBridge {
  fn drop(&mut self) {
    if let Ok(mut child) = self._child.lock() {
      let _ = child.kill();
    }
  }
}
