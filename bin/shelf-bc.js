#!/usr/bin/env node

var semver = require('semver')
var exec = require('child_process').exec
var fs = require('fs-extra')

var nodeVersion = process.version

if (semver.satisfies(nodeVersion, '<=0.12.*')) {
  backwardCompatibility()
}

function backwardCompatibility () {
  fs.move('./lib', './src', function (err) {
    if (err) {
      return console.error('first line', err)
    }

    exec('cd node_modules/shelf-bc; mv .babelrc ../../; npm run transpile', function (err) {
      if (err) {
        return console.error('second line', err)
      }
    })
  })
}
