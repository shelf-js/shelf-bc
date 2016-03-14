'use strict'

const recursive = require('recursive-readdir')
const async = require('async')
const babel = require('babel-core')
const fs = require('fs-extra')
const path = require('path')
const projectPath = process.cwd()

async.series([
  recursive.bind(recursive, 'lib'),
  recursive.bind(recursive, 'test'),
  (done) => done(
    null,
    path.resolve(projectPath, 'index.js')
  )
], (err, files) => {
  if (err) return console.error(err)

  files = [].concat.apply([], files)

  files = files.map((file) => {
    return transformFileContent(file)
  })

  async.parallel(files, (err) => {
    if (err) console.error(err)
  })
})

function transformFileContent (file) {
  const options = {
    presets: ['es2015']
  }

  return (done) => babel.transformFile(
    file,
    options,
    writeFileWithNewContent(file, done)
  )
}

function writeFileWithNewContent (file, done) {
  return (err, result) => {
    if (err) return done(err)

    fs.writeFile(file, result.code, done)
  }
}
