var sel = require('utilise/sel')

module.exports = function sall(scope){
  var parent = !scope ? d3
             : scope.node ? scope 
             : sel(scope)
  return function(selector){
    return selector.node ? selector
         : selector.nodeName ? sel(selector)
         : parent.selectAll(selector)
  }
}