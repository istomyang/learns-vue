const { platform } = require('node:os')

exports.getUserAgent = () => {
  // in broswer
  if (typeof navigator === 'object' && 'userAgent' in navigator) {
    return navigator.userAgent
  }

  if (typeof process === 'object' && 'version' in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${
      process.arch
    })`
  }

  return 'Unknown Environment'
}
