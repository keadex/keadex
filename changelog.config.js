const fs = require('fs')

function getScopes() {
  const apps = fs
    .readdirSync('./apps', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `apps/${dirent.name}`)

  const libs = fs
    .readdirSync('./libs', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `libs/${dirent.name}`)

  const examples = fs
    .readdirSync('./examples', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `examples/${dirent.name}`)

  return apps.concat(libs).concat(examples).concat(['common'])
}

module.exports = {
  disableEmoji: true,
  maxMessageLength: 80,
  scopes: getScopes(),
}
