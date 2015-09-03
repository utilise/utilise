module.exports = function remove(k, v) {
  return function(d, i, a) {
    !v ? (d == k)    && a.splice(i,1)
       : (d[k] == v) && a.splice(i,1)
  }
}