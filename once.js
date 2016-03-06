var emitterify = require('utilise/emitterify')  
  , deep = require('utilise/key')  

module.exports = once

function once(nodes, enter, exit) {
  var n = c.nodes = Array === nodes.constructor ? nodes
        : 'string' === typeof nodes ? document.querySelectorAll(nodes)
        : [nodes]

  var p = n.length
  while (p-- > 0) if (!n[p].evented) event(n[p], p)

  c.node  = function() { return n[0] }
  c.enter = function() { return once(enter) }
  c.exit  = function() { return once(exit) }
  c.text  = function(value){ 
    var fn = 'function' === typeof value
    return arguments.length === 0 ? n[0].textContent : (this.each(function(d, i){
      var r = '' + (fn ? value.call(this, d, i) : value), t
      if (this.textContent !== r) 
        !(t = this.firstChild) ? this.appendChild(document.createTextNode(r))
        : t.nodeName === '#text' ? t.nodeValue = r
        : this.textContent = r
    }), this)
  }
  c.html = function(value){
    var fn = 'function' === typeof value
    return arguments.length === 0 ? n[0].innerHTML : (this.each(function(d, i){
      var r = '' + (fn ? value.call(this, d, i) : value), t
      if (this.innerHTML !== r) this.innerHTML = r
    }), this)
  }
  c.attr = function(key, value){
    var fn = 'function' === typeof value
    return arguments.length === 1 ? n[0].getAttribute(key) : (this.each(function(d, i){
      var r = fn ? value.call(this, d, i) : value
           if (!r && this.hasAttribute(key)) this.removeAttribute(key)
      else if ( r && this.getAttribute(key) !== r) this.setAttribute(key, r)
    }), this) 
  }
  c.classed = function(key, value){
    var fn = 'function' === typeof value
    return arguments.length === 1 ? n[0].classList.contains(key) : (this.each(function(d, i){
      var r = fn ? value.call(this, d, i) : value
           if ( r && !this.classList.contains(key)) this.classList.add(key)
      else if (!r &&  this.classList.contains(key)) this.classList.remove(key)
    }), this) 
  }
  c.property = function(key, value){
    var fn = 'function' === typeof value
    return arguments.length === 1 ? deep(key)(n[0]) : (this.each(function(d, i){
      var r = fn ? value.call(this, d, i) : value
      if (r !== undefined && deep(key)(this) !== r) deep(key, function(){ return r })(this)
    }), this) 
  }
  c.each = function(fn){
    p = 0; while(node = n[p++])
      fn.call(node, node.__data__, p-1)
    return this
  }
  c.remove = function(){
    this.each(function(d){
      this.parentNode.removeChild(this)
    }) 
    return this
  }
  c.draw = proxy('draw', c)
  c.once = proxy('once', c)
  c.emit = proxy('emit', c)
  c.on   = proxy('on', c)

  return c
  
  function c(s, d, k, b) {
    var lpar = n.length
      , selector
      , data
      , tag
      , tnodes = []
      , tenter = []
      , texit  = []
      , parent
      , child
      , j = 0
      , i = 0
      , attrs = [], css = []

    p = lpar + 1
    if (arguments.length === 1) {
      if ('string' !== typeof s) return once(s)

      while (--p > 0) 
        tnodes = tnodes.concat(Array.prototype.slice.call(n[lpar - p].querySelectorAll(s),0))

      return once(tnodes)
    }

    if (d === 1 && 'string' === typeof s && arguments.length == 2) {
      while (--p > 0) { 
        parent = n[lpar - p]
        j = parent.children.length

        while (j-- > 0) { 
          if (parent.children[j].matches(s)) {
            tnodes[tnodes.length] = parent.children[j] 
            parent.children[j].__data__ = parent.__data__ || 1
            break
          }
        }

        if (j < 0) {
          tag = /([^\.\[]*)/.exec(s)[1] || 'div'
          parent.appendChild(child = tnodes[tnodes.length] = tenter[tenter.length] = document.createElement(tag))
          
          attrs = [], css = []

          s.replace(/\[(.+?)="(.*?)"\]/g, function($1, $2, $3){ return attrs[attrs.length] = [$2, $3], '' })
           .replace(/\.([^.]+)/g, function($1, $2){ return css[css.length] = $2, ''})

          for (i = 0; i < attrs.length; i++) 
            child.setAttribute(attrs[i][0], attrs[i][1])

          for (i = 0; i < css.length; i++) 
            child.classList.add(css[i])

          child.__data__ = parent.__data__ || 1
        }
      }
      return once(tnodes, tenter, texit)
    }

    while (--p > 0) {
      parent   = n[lpar - p]
      selector = 'function' === typeof s ? s(parent.__data__) : s
      data     = 'function' === typeof d ? d(parent.__data__) : d

      if (d === 1)                    data = parent.__data__ || [1]
      if ('string'   === typeof data) data = [data]
      if (!data)                      data = []
      if (data.constructor !== Array) data = [data]

      var lall = parent.children.length
        , l = lall + 1
        , lnod  = data.length
        , nodes = new Array(lnod)

      j = 0
      while (--l > 0) { 
        child = parent.children[lall - l]

        if (!child.matches(selector)) continue

        if (++j > lnod) {
          lall--
          parent.removeChild(texit[texit.length] = child)
          continue
        }

        child.__data__ = data[j-1]
        tnodes[tnodes.length] = nodes[j-1] = child
        if ('function' === typeof nodes[j-1].draw) nodes[j-1].draw()
      }

      while (j++ < lnod) {
        tag = selector.call ? selector(data[j-1], j-1)
            : /([^\.\[]*)/.exec(selector)[1] || 'div'

        b ? parent.insertBefore(nodes[j-1] = tnodes[tnodes.length] = tenter[tenter.length] = document.createElement(tag), parent.querySelector(b))
          : parent.appendChild(nodes[j-1] = tnodes[tnodes.length] = tenter[tenter.length] = document.createElement(tag))
        
        attrs = [], css = []

        selector
          .toString()
          .replace(/\[(.+?)="(.*?)"\]/g, function($1, $2, $3){ return attrs[attrs.length] = [$2, $3], '' })
          .replace(/\.([^.]+)/g, function($1, $2){ return css[css.length] = $2, ''})

        for (i = 0; i < attrs.length; i++) 
          nodes[j-1].setAttribute(attrs[i][0], attrs[i][1])

        for (i = 0; i < css.length; i++) 
          nodes[j-1].classList.add(css[i])

        nodes[j-1].__data__ = data[j-1]
      }
    }

    return once(tnodes, tenter, texit)
  }

}

function event(node, index) {
  if (!node.on) emitterify(node)
  var on = node.on
    , emit = node.emit

  node.evented = true

  node.on = function(type) {
    node.addEventListener(type.split('.').shift(), reemit)
    on.apply(node, arguments)
    return node
  }

  node.emit = function(type, detail, p) {
    var params = p || { detail: detail, bubbles: false, cancelable: false }
    ;(node.host || node).dispatchEvent(new window.CustomEvent(type, params))
    return node
  }

  function reemit(event){
    window.event = event || window.event
    if ('object' === typeof window.d3) window.d3.event = event
    var isCustom = event.constructor.name === 'CustomEvent' || ~(event.toString().indexOf('CustomEvent'))
    emit(event.type, [(isCustom && event.detail) || this.__data__, index])
  }
}

function proxy(fn, c) {
  return function(){
    var args = arguments
    c.each(function(d){
      this[fn] && this[fn].apply(this, args)
    }) 
    return c 
  }
}