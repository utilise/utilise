var act = { add: add, update: update, remove: remove }
  , emitterify = require('utilise/emitterify')
  , def = require('utilise/def')
  , is  = require('utilise/is')
  , str = JSON.stringify
  , parse = JSON.parse

module.exports = function set(d) {
  return function(o, existing) {
    if (!is.obj(o))
      return o

    if (!is.obj(d)) { 
      var s = str(o)
        , log = existing || o.log || []
        , log = log.concat({ type: 'update', value: parse(s), time: log.length })
        , root = parse(s)

      return def(emitterify(root, null), 'log', log), root
    }

    if (is.def(d.key))
      apply(o, d.type, (d.key = '' + d.key).split('.'), d.value)

    if (o.log) 
      o.log.push((d.time = o.log.length, d))

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