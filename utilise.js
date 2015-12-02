(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.utilise = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var to = require('utilise/to')

module.exports = function all(selector, doc){
  var prefix = !doc && document.head.createShadowRoot ? 'html /deep/ ' : ''
  return to.arr((doc || document).querySelectorAll(prefix+selector))
}
},{"utilise/to":71}],2:[function(require,module,exports){
module.exports = function append(v) {
  return function(d){
    return d+v
  }
}
},{}],3:[function(require,module,exports){
var to = require('utilise/to')
  , is = require('utilise/is')

module.exports = function args(indices) {
  return function (fn, ctx) {
    return function(){
      var i = is.arr(indices) ? indices : [indices]
        , a = to.arr(arguments)
                .filter(function(d,x){ return is.in(i)(x) })

      return fn.apply(ctx || this, a)
    }
  }
}
},{"utilise/is":36,"utilise/to":71}],4:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function attr(d, name, value) {
  d = d.node ? d.node() : d
  if (is.str(d)) return function(el){ return attr(this.nodeName || this.node ? this : el, d) }

  return arguments.length > 2 && value === false ? d.removeAttribute(name)
       : arguments.length > 2                    ? (d.setAttribute(name, value), value)
       : d.attributes.getNamedItem(name) 
      && d.attributes.getNamedItem(name).value
}

},{"utilise/is":36}],5:[function(require,module,exports){
var key = require('utilise/key')

module.exports = function az(k) {
  return function(a, b){
    var ka = key(k)(a) || ''
      , kb = key(k)(b) || ''

    return ka > kb ?  1 
         : ka < kb ? -1 
                   :  0
  }
}

},{"utilise/key":38}],6:[function(require,module,exports){
module.exports = function body(ripple){
  return function(name){
    var res = ripple.resources[name]
    return res && res.body
  }
}
},{}],7:[function(require,module,exports){
var key = require('utilise/key')
  , is  = require('utilise/is')

module.exports = function by(k, v){
  var exists = arguments.length == 1
  return function(o){
    var d = key(k)(o)
    
    return d && v && d.toLowerCase && v.toLowerCase ? d.toLowerCase() === v.toLowerCase()
         : exists ? Boolean(d)
         : is.fn(v) ? v(d)
         : d == v
  }
}
},{"utilise/is":36,"utilise/key":38}],8:[function(require,module,exports){
module.exports = function chainable(fn) {
  return function(){
    return fn.apply(this, arguments), fn
  }
}
},{}],9:[function(require,module,exports){
module.exports = typeof window != 'undefined'
},{}],10:[function(require,module,exports){
var parse = require('utilise/parse')
  , str = require('utilise/str')
  , is = require('utilise/is')

module.exports = function clone(d) {
  return !is.fn(d) && !is.str(d)
       ? parse(str(d))
       : d
}

},{"utilise/is":36,"utilise/parse":53,"utilise/str":68}],11:[function(require,module,exports){
var client = require('utilise/client')
  , colors = !client && require('colors')
  , has = require('utilise/has')
  , is = require('utilise/is')

module.exports = colorfill()

function colorfill(){
  /* istanbul ignore next */
  ['red', 'green', 'bold', 'grey', 'strip'].forEach(function(color) {
    !is.str(String.prototype[color]) && Object.defineProperty(String.prototype, color, {
      get: function() {
        return String(this)
      } 
    })
  })
}


},{"colors":46,"utilise/client":9,"utilise/has":30,"utilise/is":36}],12:[function(require,module,exports){
module.exports = function copy(from, to){ 
  return function(d){ 
    return to[d] = from[d], d
  }
}
},{}],13:[function(require,module,exports){
var sel = require('utilise/sel')

module.exports = function datum(node){
  return sel(node).datum()
}
},{"utilise/sel":64}],14:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function debounce(d){
  var pending, wait = is.num(d) ? d : 100

  return is.fn(d) 
       ? next(d)
       : next

  function next(fn){
    return function(){
      var ctx = this, args = arguments
      pending && clearTimeout(pending)
      pending = setTimeout(function(){ fn.apply(ctx, args) }, wait)
    }
  }
  
}
},{"utilise/is":36}],15:[function(require,module,exports){
var has = require('utilise/has')

module.exports = function def(o, p, v, w){
  !has(o, p) && Object.defineProperty(o, p, { value: v, writable: w })
  return o[p]
}

},{"utilise/has":30}],16:[function(require,module,exports){
var extend = require('utilise/extend')
  , keys = require('utilise/keys')
  , is = require('utilise/is')

module.exports = function defaults(o, k, v){
  return is.obj(k) 
       ? (keys(k).map(function(i) { set(i, k[i]) }), o)
       : (set(k, v), v)

  function set(k, v) {
    if (!is.def(o[k])) o[k] = v
  }
}
},{"utilise/extend":20,"utilise/is":36,"utilise/keys":39}],17:[function(require,module,exports){
var attr = require('utilise/attr')
  , split = require('utilise/split')
  , replace = require('utilise/replace')
  , prepend = require('utilise/prepend')

module.exports = function el(selector){
  var attrs = selector.split('[')
        .map(replace(']', ''))
        .map(split('='))
    , css  = attrs.shift().shift().split('.')
    , tag  = css.shift()
    , elem = document.createElement(tag)

  attrs.forEach(function(d){ attr(elem, d[0], d[1]) })
  css.forEach(function(d){ elem.classList.add(d)})
  elem.toString = function(){ return tag + css.map(prepend('.')).join('') }

  return elem
}
},{"utilise/attr":4,"utilise/prepend":55,"utilise/replace":62,"utilise/split":67}],18:[function(require,module,exports){
var err  = require('utilise/err')('[emitterify]')
  , keys = require('utilise/keys')
  , def  = require('utilise/def')
  , not  = require('utilise/not')
  , is   = require('utilise/is')
  
module.exports = function emitterify(body) {
  return def(body, 'on', on, 1)
       , def(body, 'once', once, 1)
       , def(body, 'emit', emit, 1)
       , body

  function emit(type, param, filter) {
    var ns = type.split('.')[1]
      , id = type.split('.')[0]
      , li = body.on[id] || []
      , tt = li.length-1
      , pm = is.arr(param) ? param : [param || body]

    if (ns) return invoke(li, ns, pm), body

    for (var i = li.length; i >=0; i--)
      invoke(li, i, pm)

    keys(li)
      .filter(not(isFinite))
      .filter(filter || Boolean)
      .map(function(n){ return invoke(li, n, pm) })

    return body
  }

  function invoke(o, k, p){
    if (!o[k]) return
    var fn = o[k]
    o[k].once && (isFinite(k) ? o.splice(k, 1) : delete o[k])
    try { fn.apply(body, p) } catch(e) { err(e, e.stack)  }
   }

  function on(type, callback) {
    var ns = type.split('.')[1]
      , id = type.split('.')[0]

    body.on[id] = body.on[id] || []
    return !callback && !ns ? (body.on[id])
         : !callback &&  ns ? (body.on[id][ns])
         :  ns              ? (body.on[id][ns] = callback, body)
                            : (body.on[id].push(callback), body)
  }

  function once(type, callback){
    return callback.once = true, body.on(type, callback), body
  }
}
},{"utilise/def":15,"utilise/err":19,"utilise/is":36,"utilise/keys":39,"utilise/not":49}],19:[function(require,module,exports){
var owner = require('utilise/owner')
  , to = require('utilise/to')

module.exports = function err(prefix){
  return function(d){
    if (!owner.console || !console.error.apply) return d;
    var args = to.arr(arguments)
    args.unshift(prefix.red ? prefix.red : prefix)
    return console.error.apply(console, args), d
  }
}
},{"utilise/owner":52,"utilise/to":71}],20:[function(require,module,exports){
var is = require('utilise/is')
  , not = require('utilise/not')
  , keys = require('utilise/keys')
  , copy = require('utilise/copy')

module.exports = function extend(to){ 
  return function(from){
    keys(from)
      .filter(not(is.in(to)))
      .map(copy(from, to))

    return to
  }
}
},{"utilise/copy":12,"utilise/is":36,"utilise/keys":39,"utilise/not":49}],21:[function(require,module,exports){
module.exports = function falsy(){
  return false
}
},{}],22:[function(require,module,exports){
module.exports = function filter(fn){
  return function(arr){
    return arr.filter(fn)
  }
}

},{}],23:[function(require,module,exports){
module.exports = function first(d){
  return d[0]
}
},{}],24:[function(require,module,exports){
var is = require('utilise/is')  

module.exports = function flatten(p,v){ 
  is.arr(v) && (v = v.reduce(flatten, []))
  return (p = p || []), p.concat(v) 
}

},{"utilise/is":36}],25:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function fn(candid){
  return is.fn(candid) ? candid
       : (new Function("return " + candid))()
}
},{"utilise/is":36}],26:[function(require,module,exports){
var datum = require('utilise/datum')
  , key = require('utilise/key')

module.exports = from
from.parent = fromParent

function from(o){
  return function(k){
    return key(k)(o)
  }
}

function fromParent(k){
  return datum(this.parentNode)[k]
}
},{"utilise/datum":13,"utilise/key":38}],27:[function(require,module,exports){
var to = require('utilise/to')
  , is = require('utilise/is')

module.exports = function grep(o, k, regex){
  var original = o[k] 
  o[k] = function(){ 
    var d = to.arr(arguments).filter(is.str).join(' ')
    return d.match(regex) && original.apply(this, arguments) 
  }
  return original
}
},{"utilise/is":36,"utilise/to":71}],28:[function(require,module,exports){
var client = require('utilise/client')
  , owner = require('utilise/owner')

module.exports = function group(prefix, fn){
  if (!owner.console) return fn()
  if (!console.groupCollapsed) polyfill()
  console.groupCollapsed(prefix)
  fn()
  console.groupEnd(prefix)
}

function polyfill() {
  console.groupCollapsed = console.groupEnd = function(d){
    console.log('*****', d, '*****')
  }
}
},{"utilise/client":9,"utilise/owner":52}],29:[function(require,module,exports){
var key = require('utilise/key')

module.exports = function gt(k, v){
  return function(d){
    return key(k)(d) > v
  }
}

},{"utilise/key":38}],30:[function(require,module,exports){
module.exports = function has(o, k) {
  return k in o
}
},{}],31:[function(require,module,exports){
module.exports = function hashcode(str) {
  var hash = 0
  if (!str) return hash
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash
  }
  return hash
}

},{}],32:[function(require,module,exports){
var has = require('utilise/has')

module.exports = function header(header, value) {
  var getter = arguments.length == 1
  return function(d){ 
    return !d                      ? null
         : !has(d, 'headers')      ? null
         : !has(d.headers, header) ? null
         : getter                  ? d['headers'][header]
                                   : d['headers'][header] == value
  }
}
},{"utilise/has":30}],33:[function(require,module,exports){
module.exports = function identity(d) {
  return d
}
},{}],34:[function(require,module,exports){
module.exports = function includes(pattern){
  return function(d){
    return d && d.indexOf && ~d.indexOf(pattern)
  }
}
},{}],35:[function(require,module,exports){
var identity = require('utilise/identity')
  , wrap = require('utilise/wrap')
  , is = require('utilise/is')

module.exports = function inherit(thing) {
  if (arguments.length > 1) return [thing]
  var len = is.num(thing) ? thing : 1
    , fn = is.fn(thing) ? thing : identity

  return function(d) {
    return new Array(len + 1)
      .join('0')
      .split('')
      .map(wrap(fn(d)))
  }
}
},{"utilise/identity":33,"utilise/is":36,"utilise/wrap":75}],36:[function(require,module,exports){
module.exports = is
is.fn     = isFunction
is.str    = isString
is.num    = isNumber
is.obj    = isObject
is.lit    = isLiteral
is.bol    = isBoolean
is.truthy = isTruthy
is.falsy  = isFalsy
is.arr    = isArray
is.null   = isNull
is.def    = isDef
is.in     = isIn

function is(v){
  return function(d){
    return d == v
  }
}

function isFunction(d) {
  return typeof d == 'function'
}

function isBoolean(d) {
  return typeof d == 'boolean'
}

function isString(d) {
  return typeof d == 'string'
}

function isNumber(d) {
  return typeof d == 'number'
}

function isObject(d) {
  return typeof d == 'object'
}

function isLiteral(d) {
  return typeof d == 'object' 
      && !(d instanceof Array)
}

function isTruthy(d) {
  return !!d == true
}

function isFalsy(d) {
  return !!d == false
}

function isArray(d) {
  return d instanceof Array
}

function isNull(d) {
  return d === null
}

function isDef(d) {
  return typeof d !== 'undefined'
}

function isIn(set) {
  return function(d){
    return !set ? false  
         : set.indexOf ? ~set.indexOf(d)
         : d in set
  }
}
},{}],37:[function(require,module,exports){
var clone = require('utilise/clone')
  , key = require('utilise/key')
  , by = require('utilise/by')
  , is = require('utilise/is')

module.exports = function join(left, right){
  if (arguments.length == 1) {
    right = left
    left = null
  }

  return function(d){
    var table = right || [], field = null

    if (is.str(right)) {
      var array = right.split('.')
      table = ripple(array.shift())
      field = array.join('.')
    }
    
    var id  = key(left)(d)
      , val = table
                .filter(by('id', id))
                .map(key(field))
                .pop() || {}

    return left 
      ? key(left, val)(d) 
      : val
  }
}

},{"utilise/by":7,"utilise/clone":10,"utilise/is":36,"utilise/key":38}],38:[function(require,module,exports){
var is = require('utilise/is')
  , str = require('utilise/str')

module.exports = function key(k, v){ 
  var set = arguments.length > 1
    , keys = str(k).split('.')
    , root = keys.shift()

  return function deep(o, i){
    var masked = {}
    return !o ? undefined 
         : !k ? o
         : is.arr(k) ? (k.map(copy), masked)
         : o[k] || !keys.length ? (set ? ((o[k] = is.fn(v) ? v(o[k], i) : v), o)
                                       :   o[k])
                                : (set ? (key(keys.join('.'), v)(o[root] ? o[root] : (o[root] = {})), o)
                                       : key(keys.join('.'))(o[root]))

    function copy(k){
      var val = key(k)(o)
      ;(val != undefined) && key(k, val)(masked)
    }
  }
}
},{"utilise/is":36,"utilise/str":68}],39:[function(require,module,exports){
module.exports = function keys(o) {
  return Object.keys(o || {})
}
},{}],40:[function(require,module,exports){
module.exports =  function last(d) {
  return d[d.length-1]
}
},{}],41:[function(require,module,exports){
var attr = require('utilise/attr')
  , raw = require('utilise/raw')
  
module.exports = link

function link(from, to){
  var key = from + '|' + to
    , from = destructure(from)
    , to = destructure(to)
    
  if (!from.el || !to.el) return;
  update()

  var muto = new MutationObserver(update)

  muto.observe(from.el, {
    'attributes': true
  , 'attributeFilter': [from.attr]
  })

  function update(){ 
    var val = attr(from.el, from.attr)
    attr(to.el, to.attr, val) 
  }
  
}

function destructure(selector){
  var el = selector.split('[')[0]
    , attr = selector.split('[')[1].split(']')[0]

  return { el: raw(el), attr: attr }
}
},{"utilise/attr":4,"utilise/raw":59}],42:[function(require,module,exports){
module.exports = function lo(d){
  return (d || '').toLowerCase()
}

},{}],43:[function(require,module,exports){
var is = require('utilise/is')
  , to = require('utilise/to')
  , owner = require('utilise/owner')

module.exports = function log(prefix){
  return function(d){
    if (!owner.console || !console.log.apply) return d;
    is.arr(arguments[2]) && (arguments[2] = arguments[2].length)
    var args = to.arr(arguments)
    args.unshift(prefix.grey ? prefix.grey : prefix)
    return console.log.apply(console, args), d
  }
}
},{"utilise/is":36,"utilise/owner":52,"utilise/to":71}],44:[function(require,module,exports){
var key = require('utilise/key')

module.exports = function lt(k, v){
  return function(d){
    return key(k)(d) < v
  }
}

},{"utilise/key":38}],45:[function(require,module,exports){
var owner = require('utilise/owner')

module.exports = mo
mo.format = moFormat
mo.iso = moIso

function mo(d){
  return owner.moment(d)
}

function moFormat(format) {
  return function(d){
    return mo(d).format(format)
  }
}

function moIso(d) {
  return mo(d).format('YYYY-MM-DD')
}
},{"utilise/owner":52}],46:[function(require,module,exports){

},{}],47:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],48:[function(require,module,exports){
module.exports = function noop(){}
},{}],49:[function(require,module,exports){
module.exports = function not(fn){
  return function(){
    return !fn.apply(this, arguments)
  }
}
},{}],50:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function nullify(fn){
  return is.fn(fn) ? function(){
      return fn.apply(this, arguments) ? true : null
    } 
  : fn ? true
  : null
}
},{"utilise/is":36}],51:[function(require,module,exports){
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
},{"utilise/emitterify":18,"utilise/extend":20,"utilise/is":36,"utilise/proxy":57,"utilise/sall":63,"utilise/sel":64,"utilise/to":71,"utilise/wrap":75}],52:[function(require,module,exports){
(function (global){
module.exports = require('utilise/client') ? /* istanbul ignore next */ window : global
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"utilise/client":9}],53:[function(require,module,exports){
module.exports = function parse(d){
  return d && JSON.parse(d)
}
},{}],54:[function(require,module,exports){
(function (process){
var log = require('utilise/log')('[perf]')
  , client = require('utilise/client')

module.exports =  function perf(fn, msg) {
  return function(){
    /* istanbul ignore next */
    var start  = client ? performance.now() : process.hrtime()
      , retval = fn.apply(this, arguments)
      , diff   = client ? performance.now() - start : process.hrtime(start)

    !client && (diff = (diff[0]*1e3 + diff[1]/1e6))
    diff = Math.round(diff*100)/100
    log(msg || fn.name, diff, 'ms'), diff
    return retval
  }
}
}).call(this,require('_process'))
},{"_process":47,"utilise/client":9,"utilise/log":43}],55:[function(require,module,exports){
module.exports = function prepend(v) {
  return function(d){
    return v+d
  }
}
},{}],56:[function(require,module,exports){
promise.sync = promiseSync
promise.null = promiseNull
promise.noop = promiseNoop
promise.args = promiseArgs
module.exports = promise

function promise() {
  var resolve
    , reject
    , p = new Promise(function(res, rej){ 
        resolve = res, reject = rej
      })

  arguments.length && resolve(arguments[0])
  p.resolve = resolve
  p.reject  = reject
  return p
}

function promiseArgs(i){
  return function(){
    return promise(arguments[i])
  }
}

function promiseSync(arg){
  return function() {
    var a = arguments
      , o = { then: function(cb){ cb(a[arg]); return o } }
    return o
  }
}

function promiseNoop(){
  return promise()
}

function promiseNull(){
  return promise(null)
}
},{}],57:[function(require,module,exports){
var is = require('utilise/is')
  , identity = require('utilise/identity')

module.exports = function proxy(fn, ret, ctx){ 
  return function(){
    var result = (fn || identity).apply(ctx || this, arguments)
    return is.fn(ret) ? ret.call(ctx || this, result) : ret || result
  }
}
},{"utilise/identity":33,"utilise/is":36}],58:[function(require,module,exports){
module.exports = function push(arr){
  return function(d){
    return arr.push(d), arr
  }
}

},{}],59:[function(require,module,exports){
module.exports = function raw(selector, doc){
  var prefix = !doc && document.head.createShadowRoot ? 'html /deep/ ' : ''
  return (doc ? doc : document).querySelector(prefix+selector)
}
},{}],60:[function(require,module,exports){
module.exports = function(target, source) {
  var i = 1, n = arguments.length, method
  while (++i < n) target[method = arguments[i]] = rebind(target, source, source[method])
  return target
}

function rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments)
    return value === source ? target : value
  }
}
},{}],61:[function(require,module,exports){
module.exports = function remove(k, v) {
  return function(d, i, a) {
    !v ? (d == k)    && a.splice(i,1)
       : (d[k] == v) && a.splice(i,1)
  }
}
},{}],62:[function(require,module,exports){
module.exports = function replace(from, to){
  return function(d){
    return d.replace(from, to)
  }
}
},{}],63:[function(require,module,exports){
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
},{"utilise/sel":64}],64:[function(require,module,exports){
module.exports = function sel(el){
  return el.node ? el : d3.select(el)
}
},{}],65:[function(require,module,exports){
module.exports = function slice(from, to){
  return function(d){
    return d.slice(from, to)
  }
}
},{}],66:[function(require,module,exports){
module.exports = function sort(fn){
  return function(arr){
    return arr.sort(fn)
  }
}

},{}],67:[function(require,module,exports){
module.exports = function split(delimiter){
  return function(d){
    return d.split(delimiter)
  }
}

},{}],68:[function(require,module,exports){
var is = require('utilise/is') 

module.exports = function str(d){
  return d === 0 ? '0'
       : !d ? ''
       : is.fn(d) ? '' + d
       : is.obj(d) ? JSON.stringify(d)
       : String(d)
}
},{"utilise/is":36}],69:[function(require,module,exports){
module.exports = function time(ms, fn) {
  return setTimeout(fn, ms)
}
},{}],70:[function(require,module,exports){
require('./owner').all = require('./all.js')
require('./owner').append = require('./append.js')
require('./owner').args = require('./args.js')
require('./owner').attr = require('./attr.js')
require('./owner').az = require('./az.js')
require('./owner').body = require('./body.js')
require('./owner').by = require('./by.js')
require('./owner').chainable = require('./chainable.js')
require('./owner').client = require('./client.js')
require('./owner').clone = require('./clone.js')
require('./owner').colorfill = require('./colorfill.js')
require('./owner').copy = require('./copy.js')
require('./owner').datum = require('./datum.js')
require('./owner').debounce = require('./debounce.js')
require('./owner').def = require('./def.js')
require('./owner').defaults = require('./defaults.js')
require('./owner').el = require('./el.js')
require('./owner').emitterify = require('./emitterify.js')
require('./owner').err = require('./err.js')
require('./owner').extend = require('./extend.js')
require('./owner').falsy = require('./falsy.js')
require('./owner').filter = require('./filter.js')
require('./owner').first = require('./first.js')
require('./owner').flatten = require('./flatten.js')
require('./owner').fn = require('./fn.js')
require('./owner').from = require('./from.js')
require('./owner').grep = require('./grep.js')
require('./owner').group = require('./group.js')
require('./owner').gt = require('./gt.js')
require('./owner').has = require('./has.js')
require('./owner').hashcode = require('./hashcode.js')
require('./owner').header = require('./header.js')
require('./owner').identity = require('./identity.js')
require('./owner').includes = require('./includes.js')
require('./owner').inherit = require('./inherit.js')
require('./owner').is = require('./is.js')
require('./owner').join = require('./join.js')
require('./owner').key = require('./key.js')
require('./owner').keys = require('./keys.js')
require('./owner').last = require('./last.js')
require('./owner').link = require('./link.js')
require('./owner').lo = require('./lo.js')
require('./owner').log = require('./log.js')
require('./owner').lt = require('./lt.js')
require('./owner').mo = require('./mo.js')
require('./owner').noop = require('./noop.js')
require('./owner').not = require('./not.js')
require('./owner').nullify = require('./nullify.js')
require('./owner').once = require('./once.js')
require('./owner').owner = require('./owner.js')
require('./owner').parse = require('./parse.js')
require('./owner').perf = require('./perf.js')
require('./owner').prepend = require('./prepend.js')
require('./owner').promise = require('./promise.js')
require('./owner').proxy = require('./proxy.js')
require('./owner').push = require('./push.js')
require('./owner').raw = require('./raw.js')
require('./owner').rebind = require('./rebind.js')
require('./owner').remove = require('./remove.js')
require('./owner').replace = require('./replace.js')
require('./owner').sall = require('./sall.js')
require('./owner').sel = require('./sel.js')
require('./owner').slice = require('./slice.js')
require('./owner').sort = require('./sort.js')
require('./owner').split = require('./split.js')
require('./owner').str = require('./str.js')
require('./owner').time = require('./time.js')
require('./owner').to = require('./to.js')
require('./owner').unique = require('./unique.js')
require('./owner').values = require('./values.js')
require('./owner').wait = require('./wait.js')
require('./owner').wrap = require('./wrap.js')
require('./owner').za = require('./za.js')

},{"./all.js":1,"./append.js":2,"./args.js":3,"./attr.js":4,"./az.js":5,"./body.js":6,"./by.js":7,"./chainable.js":8,"./client.js":9,"./clone.js":10,"./colorfill.js":11,"./copy.js":12,"./datum.js":13,"./debounce.js":14,"./def.js":15,"./defaults.js":16,"./el.js":17,"./emitterify.js":18,"./err.js":19,"./extend.js":20,"./falsy.js":21,"./filter.js":22,"./first.js":23,"./flatten.js":24,"./fn.js":25,"./from.js":26,"./grep.js":27,"./group.js":28,"./gt.js":29,"./has.js":30,"./hashcode.js":31,"./header.js":32,"./identity.js":33,"./includes.js":34,"./inherit.js":35,"./is.js":36,"./join.js":37,"./key.js":38,"./keys.js":39,"./last.js":40,"./link.js":41,"./lo.js":42,"./log.js":43,"./lt.js":44,"./mo.js":45,"./noop.js":48,"./not.js":49,"./nullify.js":50,"./once.js":51,"./owner":52,"./owner.js":52,"./parse.js":53,"./perf.js":54,"./prepend.js":55,"./promise.js":56,"./proxy.js":57,"./push.js":58,"./raw.js":59,"./rebind.js":60,"./remove.js":61,"./replace.js":62,"./sall.js":63,"./sel.js":64,"./slice.js":65,"./sort.js":66,"./split.js":67,"./str.js":68,"./time.js":69,"./to.js":71,"./unique.js":72,"./values.js":73,"./wait.js":74,"./wrap.js":75,"./za.js":76}],71:[function(require,module,exports){
module.exports = { 
  arr: toArray
, obj: toObject
}

function toArray(d){
  return Array.prototype.slice.call(d, 0)
}

function toObject(d) {
  var by = 'id'
    , o = {}

  return arguments.length == 1 
    ? (by = d, reduce)
    : reduce.apply(this, arguments)

  function reduce(p,v,i){
    if (i === 0) p = {}
    p[v[by]] = v
    return p
  }
}
},{}],72:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function unique(d, i){
  if (!i) unique.matched = []
  return !is.in(unique.matched)(d) 
       ? unique.matched.push(d)
       : false 
}

},{"utilise/is":36}],73:[function(require,module,exports){
var keys = require('utilise/keys')
  , from = require('utilise/from')

module.exports = function values(o) {
  return !o ? [] : keys(o).map(from(o))
}
},{"utilise/from":26,"utilise/keys":39}],74:[function(require,module,exports){
module.exports = function wait(condition){
  return function(handler){
    return function(){
      var result = condition.apply(this, arguments)
      result
        ? handler.apply(this, arguments)
        : this.once('change', wait(condition)(handler))
    }
  }
}
},{}],75:[function(require,module,exports){
module.exports = function wrap(d){
  return function(){
    return d
  }
}
},{}],76:[function(require,module,exports){
var key = require('utilise/key')

module.exports = function za(k) {
  return function(a, b){
    var ka = key(k)(a) || ''
      , kb = key(k)(b) || ''

    return ka > kb ? -1 
         : ka < kb ?  1 
                   :  0
  }
}

},{"utilise/key":38}]},{},[70])(70)
});