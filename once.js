var emitterify = require('utilise/emitterify')  
  , extend     = require('utilise/extend')  
  , attr       = require('utilise/attr')  
  , wrap       = require('utilise/wrap')  
  , sall       = require('utilise/sall')  
  , sel        = require('utilise/sel')  
  , key        = require('utilise/key')  
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
        .order()
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
              : selector.toString().split('.').slice(1).join(' ')

  var tag     = is.fn(selector) ? selector
              : selector instanceof HTMLElement
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

function accessors(o, els){
  ;['text', 'property', 'attr', 'style', 'html', 'classed', 'each', 'node', 'datum', 'remove'].map(function(op){
    o[op] = memoize(els, op, o)
  })

  ;['draw'].map(lookup(o, els))
  
  return o
}

function lookup(o, els) {
  return function(op){
    o[op] = function() {
      var args = arguments
      els.each(function(){
        this[op].apply(this, args)
      })
      return o
    }
  }
}

function events(o, els){
  els.each(function(){ 
    var self = this
    if (self.evented) return
    if (!self.host) emitterify(self) 
    self.evented = true
  
    ;['on', 'once', 'emit'].map(function(op){ 
      if (self.host) return self[op] = self.host[op] 
      var fn = self[op]
      self[op] = function(type, d){
        var args = to.arr(arguments)  
        if (op == 'emit' && args.length == 1) args[1] = self.__data__
        fn.apply(self, args)
        if (op == 'on') self.addEventListener(type.split('.').shift(), redispatch)
        return self
      }

    })
  })

  ;['on', 'once', 'emit'].map(function(op){ 
    o[op] = function(type){
      var args = to.arr(arguments)
      els.each(function(d){ this[op].apply(this, args) })
      return o
    }
  })

  return o
}

function memoize(els, op, o) {
  var singular = op == 'html' || op == 'text'
    , property = op == 'property'
    , classed  = op == 'classed'
    , skip     = ['each', 'datum', 'remove', 'classed']
    , fn       = els[op]

  return function(name, value){
    if (singular) value = name

    return property                                 ? (deepProperty(els, arguments, o))
        :  classed  && arguments.length < 2         ? (fn.apply(els, arguments))
        :  is.in(skip)(op)                          ? (fn.apply(els, arguments), o)
        :  singular && arguments.length < 1         ? (fn.apply(els, arguments))
        : !singular && arguments.length < 2         ? (fn.apply(els, arguments))
        : (els.each(function(){
            var current = singular ? sel(this)[op]() : sel(this)[op](name)
              , target  = is.fn(value) ? value.apply(this, arguments) : value

            if (current !== target) singular ? sel(this)[op](value) : sel(this)[op](name, value)
          }), o)
  }
}

function deepProperty(els, args, o) {
  var name = args[0] 

  return args.length == 2 
       ? (els.each(set), o)
       : key(name)(els.node())

  function set() { 
    var target = is.fn(args[1]) ? args[1].apply(this, arguments) : args[1]
      , current = key(name)(this)

    if (target !== undefined && current !== target) key(name, wrap(target))(this)
  }
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