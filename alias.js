var fs = require('fs')
  , is = require('is')
  , log = require('log')
  , not = require('not')
  , keys = require('keys')
  , path = require('path')
  , values = require('values')
  , append = require('append')
  , prepend = require('prepend')
  , includes = require('includes')
  , core = ['package.json', 'alias.js']
  , modules = require('./package.json').dependencies

console.log(not)
// clean dir
fs.readdirSync(__dirname)
  .filter(includes('js'))
  .filter(not(is.in(core)))
  .map(prepend(__dirname+'/'))
  .map(log('deleting'))
  .map(fs.unlinkSync)

// create utilise/{name} aliases
keys(modules)
  .map(append('.js'))
  .map(log('creating'))
  .map(fs.createWriteStream)
  .map(function(s){ 
    s.write("module.exports = require('"+s.path.slice(0,-3)+"')")
  })

