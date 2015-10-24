var proxy  = require('utilise/proxy')  
  , wrap   = require('utilise/wrap')  
  , sall   = require('utilise/sall')  
  , sel    = require('utilise/sel')  
  , is     = require('utilise/is')  

module.exports = function once(scope) {
  var parent = scope.node ? scope : sel(scope)

  return accessorise(o, parent)

  function o(selector, data, key, before) {
    if (arguments.length == 1 && !is.fn(selector)) return once(sall(parent)(selector))
    if (arguments.length == 1 &&  is.fn(selector)) data = 1

    var fn
      , enter = []
      , exit = []
      , els = []

    parent.each(function(paData, i){
      var self = this

      var elData = data
        , elSelector = selector

      if (is.fn(elSelector)) elSelector = elSelector(paData, i)
      if (is.fn(elData))     elData = elData(paData, i)
      if (!elData)           elData = []
      if (!is.arr(elData))   elData = [elData]

      var classes = elSelector instanceof HTMLElement
                  ? elSelector.className
                  : elSelector.split('.').slice(1).join(' ')

      var type    = elSelector instanceof HTMLElement
                  ? dupe(elSelector)
                  : elSelector.split('.')[0].split('>').pop().trim() || 'div'


      var el = sel(self)
        .selectAll(elSelector.toString())
        .data(elData, key)
  
      el.exit()
        .remove()
        .each(push(exit))

      el.enter()
        .insert(type, before)
        .classed(classes, 1)
        .each(push(enter))

      el.each(push(els))
    })

    els = sall()(els)
    fn = once(els)
    fn.enter = sall()(enter)
    fn.exit = sall()(exit)
    fn.sel = els

    return accessorise(fn, els)
  }
}

function dupe(el){
  return function(){
    return el.cloneNode()
  }
}

function push(arr) {
  return function(d){ 
    arr.push(this) 
  }
}

function accessorise(o, original){
  ['text', 'classed', 'html', 'attr', 'style', 'on', 'each', 'node', 'datum', 'property'].map(function(op){
    o[op] = proxy(original[op], wrap(o), original)
  })

  return o
}