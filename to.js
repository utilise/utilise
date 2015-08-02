module.exports = { 
  arr: toArray
, obj: toObject
}

function toArray(d){
  return Array.prototype.slice.call(d, 0)
}

function toObject(d) {
  var by = 'id'
    , o = {}

  return arguments.length == 1 
    ? (by = d, reduce)
    : reduce.apply(this, arguments)

  function reduce(p,v,i){
    console.log('i', i === 0, by, p, v)//p && p.id, v && v.id)
    if (i === 0) p = {}
    p[v[by]] = v
    return p
  }
}