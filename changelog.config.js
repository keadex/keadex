const fs = require('fs')

function getScopes() {
  const apps = fs
    .readdirSync('./apps', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  const libs = fs
    .readdirSync('./libs', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  return apps.concat(libs).concat(['common'])
}

module.exports = {
  disableEmoji: true,
  maxMessageLength: 80,
  scopes: getScopes(),
}
