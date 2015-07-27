module.exports = function flatten(p,v){ 
  return (p = p || []), p.concat(v) 
}
