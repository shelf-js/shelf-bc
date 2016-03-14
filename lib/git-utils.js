'use strict'

const command = require('./command')
const async = require('async')
const JsDiff = require('diff')

let git = module.exports = {}

git.last = (cb) => command('git rev-parse HEAD', cb)

git.branchDiff = (branch1, branch2, cb) => {
  async.series([
    git.firstParent.bind(git, branch1),
    git.firstParent.bind(git, branch2)
  ], (err, res) => {
    if (err) {
      return cb(err)
    }

    let diffLines = JsDiff.diffLines(res[0], res[1], {ignoreWhitespace: false, newlineIsToken: true})
    cb(null, diffLines)
  })
}

git.firstParent = (branch, cb) =>
  command(`git rev-list --first-parent ${branch}`, { clean: false }, cb)

git.message = (commitHash, cb) =>
  command(`git show ${commitHash} --pretty=format:%s`, cb)

git.validBranch = (branch, cb) =>
  command(`git rev-parse --verify ${branch}`, cb)
