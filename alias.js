var fs = require('fs')
  , is = require('is')
  , log = require('log')
  , not = require('not')
  , args = require('args')
  , keys = require('keys')
  , path = require('path')
  , values = require('values')
  , append = require('append')
  , prepend = require('prepend')
  , includes = require('includes')
  , core = ['package.json', 'alias.js']
  , modules = require('./package.json').dependencies
  , browser = require('./package.json').browser
  , alias = "module.exports = require('{mod}')"
  , entry = "require('owner').{key} = require('{mod}')"

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
    var key = s.path.slice(0,-3)
      , mod = module(key)
      , req = alias.replace('{mod}', mod)

    return s.write(req), mod
  })
  
// expose single node entry point
var index = fs.createWriteStream('index.js')
keys(modules)
  .map(function(key){ 
    return entry
      .replace('{key}', key) 
      .replace('{mod}', module(key)) 
  })
  .map(append('\n'))
  .map(args(0)(index.write, index))

// expose single browser entry point
var tmp = fs.createWriteStream('tmp.js')
keys(modules)
  .filter(not(is.in(browser)))
  .map(function(key){ 
    return entry
      .replace('{key}', key) 
      .replace('{mod}', module(key)) 
  })
  .map(append('\n'))
  .map(args(0)(tmp.write, tmp))


function module(key){
  return modules[key].split('/').pop().slice(0,-4)
}
