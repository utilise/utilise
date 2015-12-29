var is = require('utilise/is')

module.exports = function attr(d, name, value) {
  d = d.node ? d.node() : d
  d = d.host || d
  var args = arguments.length

  if (is.str(d)) return function(el){ 
    var node = this.nodeName || this.node ? this : el
    return attr.apply(this, args > 1 ? [node, d, name] : [node, d]) 
  }

  return args > 2 && value === false ? d.removeAttribute(name)
       : args > 2                    ? (d.setAttribute(name, value), value)
       : d.attributes.getNamedItem(name) 
      && d.attributes.getNamedItem(name).value
}
