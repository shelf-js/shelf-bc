#!/usr/bin/env node

var semver = require('semver')
var recursive = require('recursive-readdir')
var async = require('async')
var babel = require('babel-core')
var fs = require('fs-extra')
var path = require('path')

var nodeVersion = process.version

if (semver.satisfies(nodeVersion, '<=0.12.*')) {
  var shelfPath = path.resolve(__dirname, '../../..')

  movePreset(function (err) {
    if (err) {
      return console.error(err)
    }

    backwardCompatibility()
  })
}

function movePreset (done) {
  var babelPresetPath = path.resolve(
    __dirname,
    '../node_modules/babel-preset-es2015'
  )

  fs.move(
    babelPresetPath,
    path.resolve(shelfPath, 'node_modules/babel-preset-es2015'),
    done
  )
}

function backwardCompatibility () {
  recursive('lib', function (err, files) {
    if (err) {
      return console.error(err)
    }

    files = files.map(function (file) {
      return transformFileContent(file)
    })

    async.parallel(files, function (err) {
      if (err) {
        console.error(err)
      }
    })
  })
}

function transformFileContent (file) {
  return function (done) {
    var options = {
      presets: ['es2015']
    }

    babel.transformFile(file, options, writeFileWithNewContent(file, done))
  }
}

function writeFileWithNewContent (file, done) {
  return function (err, result) {
    if (err) {
      return done(err)
    }

    fs.writeFile(file, result.code, done)
  }
}
