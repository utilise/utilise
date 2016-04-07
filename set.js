var act = { add: add, update: update, remove: remove }
  , emitterify = require('utilise/emitterify')
  , def = require('utilise/def')
  , is  = require('utilise/is')
  , str = JSON.stringify
  , parse = JSON.parse

module.exports = function set(d) {
  return function(o, existing, max) {
    if (!is.obj(o))
      return o

    if (!is.obj(d)) { 
      var log = existing || o.log || []
        , root = o

      if (!max)    log = []
      if (max < 0) log = log.concat(null)
      if (max > 0) {
        var s = str(o)
        root = parse(s) 
        log = log.concat({ type: 'update', value: parse(s), time: log.length })
      } 

      return def(log, 'max', max | 0)
           , def(emitterify(root, null), 'log', log)
           , root
    }

    if (is.def(d.key))
      apply(o, d.type, (d.key = '' + d.key).split('.'), d.value)

    if (o.log && o.log.max) 
      o.log.push(o.log.max > 0 ? (d.time = o.log.length, d) : null)

    if (o.emit)
      o.emit('change', d)

    return o
  }
}

function apply(body, type, path, value) {
  var next = path.shift()

  if (path.length) { 
    if (!(next in body)) 
      if (type == 'remove') return
      else body[next] = {}
    apply(body[next], type, path, value)
  }
  else 
    act[type](body, next, value)
}

function add(o, k, v) {
  is.arr(o) 
    ? o.splice(k, 0, v) 
    : (o[k] = v)
}

function update(o, k, v) { 
  o[k] = v 
}

function remove(o, k, v) { 
  is.arr(o) 
    ? o.splice(k, 1)
    : delete o[k]
}