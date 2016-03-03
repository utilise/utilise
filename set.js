var last = require('utilise/last')
  , key = require('utilise/key')
  , str = require('utilise/str')
  , is = require('utilise/is')

module.exports = exports = function set(diff) {
  return function(o) {
    if (!o || !is.obj(o) || !diff || !is.obj(diff)) return o
    var key = str(diff.key)
    act.raw[diff.type](o, key, diff.value)
    return set.commit(o, { key: key, value: diff.value, type: diff.type })
  }
}

exports.commit = function commit(o, diff) {
  var log = o.log

  if (log) log.push({ 
    diff: diff
  , value: act.imm[diff.type](last(log).value, diff.key.split('.'), diff.value) 
  })

  if (o.emit) o.emit('log', diff)

  return o
}

function leaf(o, k, v){
  var path = k.split('.')
    , tail = path.pop()
    , body = key(path.join('.'))(o)

  return { body: body, tail: tail }
}

var act = {
  raw: {
    add   : function(o, k, v) { var l = leaf(o, k); return is.arr(l.body) ? l.body.splice(l.tail, 0, v) : key(k, v)(o) }
  , update: function(o, k, v) { return key(k, v)(o) }
  , remove: function(o, k, v) { 
      var l = leaf(o, k)
      return is.arr(l.body) ? l.body.splice(l.tail, 1)
           : l.body         ? delete l.body[l.tail]
           : false 
    }
  }
, imm: {
    update: function(o, k, v) { return o.setIn(k, v) }
  , remove: function(o, k, v) { return o.deleteIn(k) }
  , add   : function(o, k, v) { 
      var path = k.slice(0, -1)
        , tail = k.slice(-1)
        , last = o.getIn(path)

      return last && last.splice 
           ? o.setIn(path, last.splice(tail, 0, v))
           : o.setIn(k, v)
    }
  }
}