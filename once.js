var emitterify = require('utilise/emitterify')  
  , extend     = require('utilise/extend')  
  , proxy      = require('utilise/proxy')  
  , wrap       = require('utilise/wrap')  
  , sall       = require('utilise/sall')  
  , sel        = require('utilise/sel')  
  , is         = require('utilise/is')  

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
  ;['text', 'classed', 'html', 'attr', 'style', 'each', 'node', 'datum', 'property'].map(function(op){
    fn[op] = proxy(els[op], wrap(fn), els)
  })
  
  return fn
}

function events(fn, els){
  els.each(function(){ emitterify(this) })

  ;['on', 'once', 'emit'].map(function(op){ 
    fn[op] = function(type, listener){
      var args = arguments
      els.each(function(){ 
        this[op].apply(this, args)
        if (op == 'on') {
          var self = this
            , ev = type.split('.').shift()
          this.addEventListener(ev, function(){ 
            this.emit(ev, self.__data__)
          })
        }
      })
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