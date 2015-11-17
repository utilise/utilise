module.exports = function sel(el){
  return el.node ? el : d3.select(el)
}