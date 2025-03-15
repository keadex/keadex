export function initConsole() {
  //---------- Disable debug and log levels in production
  if (process.env['NODE_ENV'] === 'production') {
    console.log = () => {
      // do nothing
    }
    console.debug = () => {
      // do nothing
    }
  }
}
