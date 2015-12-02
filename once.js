var emitterify = require('utilise/emitterify')  
  , extend     = require('utilise/extend')  
  , proxy      = require('utilise/proxy')  
  , wrap       = require('utilise/wrap')  
  , sall       = require('utilise/sall')  
  , sel        = require('utilise/sel')  
  , is         = require('utilise/is')  
  , to         = require('utilise/to')  

module.exports = once

function once(parents){
  return enhance(spawn(parents = sall()(parents)), parents)
}

function spawn(parents){
  return function o(selector, data, key, before){ 
    if (arguments.length == 1 && !is.fn(selector)) return once(sall(parents)(selector))
    if (arguments.length == 1 &&  is.fn(selector)) data = 1
    var enter = [], exit = [], els = []
  
    parents.each(function(pd, pi){
      var opts = options(data, selector, pd, pi)

      var el = sel(this)
        .selectAll(opts.selector)
        .data(opts.data, key)
  
      el.exit()
        .remove()
        .each(push(exit))

      el.enter()
        .insert(opts.tag, before)
        .classed(opts.classes, 1)
        .each(push(enter))

      el.each(push(els))
        .each(function(){ this.draw && this.draw() })
    })

    return extend(once(els = sall()(els)))({ 
      enter: sall()(enter)
    , exit: sall()(exit)
    , sel: els
    })
  }
}

function options(data, selector, pd, pi){
  if (is.fn(selector)) selector = selector(pd, pi)
  if (is.fn(data))     data = data(pd, pi)
  if (is.str(data))    data = [data]
  if (!data)           data = []
  if (!is.arr(data))   data = [data]

  var classes = selector instanceof HTMLElement
              ? selector.className
              : selector.split('.').slice(1).join(' ')

  var tag     = selector instanceof HTMLElement
              ? clone(selector)
              : selector.split('.')[0].split('>').pop().trim() || 'div'

  return {
    data: data
  , selector: selector.toString()
  , tag: tag
  , classes: classes
  }
}

function enhance(fn, els){
  return accessors(fn, els)
       , events(fn, els)
       , fn
}

function accessors(fn, els){
  ;['text', 'classed', 'html', 'attr', 'style', 'each', 'node', 'datum', 'property', 'remove'].map(function(op){
    fn[op] = proxy(els[op], op == 'node' ? 0 : wrap(fn), els)
  })
  
  return fn
}

function events(fn, els){
  els.each(function(){ 
    var self = this

    if (self.on) return
    if (!self.host) emitterify(self) 

    ;['on', 'once', 'emit'].map(function(op){ 
      if (self.host) return self[op] = self.host[op] 
      var fn = self[op]
      self[op] = function(type, d){
        var args = to.arr(arguments)  
        if (op == 'emit' && args.length == 1) args[1] = self.__data__
        fn.apply(self, args)
        if (op == 'on') self.addEventListener(type.split('.').shift(), redispatch)
      }

    })
  })

  ;['on', 'once', 'emit'].map(function(op){ 
    fn[op] = function(type){
      var args = to.arr(arguments)
      els.each(function(d){ this[op].apply(this, args) })
      return fn
    }
  })

  return fn
}

function clone(el){
  return function(){
    return el.cloneNode()
  }
}

function push(arr) {
  return function(d){ 
    arr.push(this) 
  }
}

function redispatch(event){
  d3.event = event
  this.emit(event.type, this.__data__)
}