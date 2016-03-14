'use strict'

const exec = require('child_process').exec

function command (cmd, opts, cb) {
  if (typeof cb !== 'function') {
    cb = opts
    opts = {
      clean: true
    }
  }

  const execOpts = {
    cwd: process.cwd()
  }

  exec(cmd, execOpts, (err, stdout) => {
    if (err) {
      return cb(err)
    }

    if (opts.clean) {
      cb(null, stdout.split('\n').join(''))
    } else {
      cb(null, stdout)
    }
  })
}

module.exports = command
