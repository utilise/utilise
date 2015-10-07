(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.utilise = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var to = require('utilise/to')

module.exports = function all(selector, doc){
  var prefix = !doc && document.head.createShadowRoot ? 'html /deep/ ' : ''
  return to.arr((doc || document).querySelectorAll(prefix+selector))
}
},{"utilise/to":68}],2:[function(require,module,exports){
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
},{"utilise/is":34,"utilise/to":68}],4:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function attr(d, name, value) {
  d = d.node ? d.node() : d
  if (is.str(d)) return function(el){ return attr(this.nodeName || this.node ? this : el, d) }

  return arguments.length > 2 && value === false ? d.removeAttribute(name)
       : arguments.length > 2                    ? d.setAttribute(name, value)
       : d.attributes.getNamedItem(name) 
      && d.attributes.getNamedItem(name).value
}

},{"utilise/is":34}],5:[function(require,module,exports){
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

},{"utilise/key":36}],6:[function(require,module,exports){
var key = require('utilise/key')

module.exports = function body(ripple){
  return function(name){
    return key([name, 'body'].join('.'))(ripple.resources)
  }
}
},{"utilise/key":36}],7:[function(require,module,exports){
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
},{"utilise/is":34,"utilise/key":36}],8:[function(require,module,exports){
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

},{"utilise/is":34,"utilise/parse":51,"utilise/str":66}],11:[function(require,module,exports){
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


},{"colors":44,"utilise/client":9,"utilise/has":29,"utilise/is":34}],12:[function(require,module,exports){
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
},{"utilise/sel":63}],14:[function(require,module,exports){
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
},{"utilise/is":34}],15:[function(require,module,exports){
var has = require('utilise/has')

module.exports = function def(o, p, v, w){
  !has(o, p) && Object.defineProperty(o, p, { value: v, writable: w })
  return o[p]
}

},{"utilise/has":29}],16:[function(require,module,exports){
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
},{"utilise/attr":4,"utilise/prepend":53,"utilise/replace":60,"utilise/split":65}],17:[function(require,module,exports){
var err  = require('utilise/err')('[emitterify]')
  , keys = require('utilise/keys')
  , def  = require('utilise/def')
  , not  = require('utilise/not')
  , is   = require('utilise/is')
  
module.exports = function emitterify(body) {
  return def(body, 'on', on)
       , def(body, 'once', once)
       , def(body, 'emit', emit)
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
},{"utilise/def":15,"utilise/err":18,"utilise/is":34,"utilise/keys":37,"utilise/not":47}],18:[function(require,module,exports){
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
},{"utilise/owner":50,"utilise/to":68}],19:[function(require,module,exports){
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
},{"utilise/copy":12,"utilise/is":34,"utilise/keys":37,"utilise/not":47}],20:[function(require,module,exports){
module.exports = function falsy(){
  return false
}
},{}],21:[function(require,module,exports){
module.exports = function filter(fn){
  return function(arr){
    return arr.filter(fn)
  }
}

},{}],22:[function(require,module,exports){
module.exports = function first(d){
  return d[0]
}
},{}],23:[function(require,module,exports){
var is = require('utilise/is')  

module.exports = function flatten(p,v){ 
  is.arr(v) && (v = v.reduce(flatten, []))
  return (p = p || []), p.concat(v) 
}

},{"utilise/is":34}],24:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function fn(candid){
  return is.fn(candid) ? candid
       : (new Function("return " + candid))()
}
},{"utilise/is":34}],25:[function(require,module,exports){
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
},{"utilise/datum":13,"utilise/key":36}],26:[function(require,module,exports){
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
},{"utilise/is":34,"utilise/to":68}],27:[function(require,module,exports){
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
},{"utilise/client":9,"utilise/owner":50}],28:[function(require,module,exports){
var key = require('utilise/key')

module.exports = function gt(k, v){
  return function(d){
    return key(k)(d) > v
  }
}

},{"utilise/key":36}],29:[function(require,module,exports){
module.exports = function has(o, k) {
  return k in o
}
},{}],30:[function(require,module,exports){
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
},{"utilise/has":29}],31:[function(require,module,exports){
module.exports = function identity(d) {
  return d
}
},{}],32:[function(require,module,exports){
module.exports = function includes(pattern){
  return function(d){
    return d && d.indexOf && ~d.indexOf(pattern)
  }
}
},{}],33:[function(require,module,exports){
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
},{"utilise/identity":31,"utilise/is":34,"utilise/wrap":72}],34:[function(require,module,exports){
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
},{}],35:[function(require,module,exports){
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

},{"utilise/by":7,"utilise/clone":10,"utilise/is":34,"utilise/key":36}],36:[function(require,module,exports){
var is = require('utilise/is')
  , str = require('utilise/str')

module.exports = function key(k, v){ 
  var set = arguments.length > 1
    , keys = str(k).split('.')
    , root = keys.shift()

  return function deep(o){
    var masked = {}
    return !o ? undefined 
         : !k ? o
         : is.arr(k) ? (k.map(copy), masked)
         : o[k] || !keys.length ? (set ? ((o[k] = is.fn(v) ? v(o[k]) : v), o)
                                       :   o[k])
                                : (set ? (key(keys.join('.'), v)(o[root] ? o[root] : (o[root] = {})), o)
                                       : key(keys.join('.'))(o[root]))

    function copy(k){
      var val = key(k)(o)
      ;(val != undefined) && key(k, val)(masked)
    }
  }
}
},{"utilise/is":34,"utilise/str":66}],37:[function(require,module,exports){
module.exports = function keys(o) {
  return Object.keys(o || {})
}
},{}],38:[function(require,module,exports){
module.exports =  function last(d) {
  return d[d.length-1]
}
},{}],39:[function(require,module,exports){
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
},{"utilise/attr":4,"utilise/raw":57}],40:[function(require,module,exports){
module.exports = function lo(d){
  return (d || '').toLowerCase()
}

},{}],41:[function(require,module,exports){
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
},{"utilise/is":34,"utilise/owner":50,"utilise/to":68}],42:[function(require,module,exports){
var key = require('utilise/key')

module.exports = function lt(k, v){
  return function(d){
    return key(k)(d) < v
  }
}

},{"utilise/key":36}],43:[function(require,module,exports){
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
},{"utilise/owner":50}],44:[function(require,module,exports){

},{}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
module.exports = function noop(){}
},{}],47:[function(require,module,exports){
module.exports = function not(fn){
  return function(){
    return !fn.apply(this, arguments)
  }
}
},{}],48:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function nullify(fn){
  return is.fn(fn) ? function(){
      return fn.apply(this, arguments) ? true : null
    } 
  : fn ? true
  : null
}
},{"utilise/is":34}],49:[function(require,module,exports){
var proxy  = require('utilise/proxy')  
  , wrap   = require('utilise/wrap')  
  , sall   = require('utilise/sall')  
  , sel    = require('utilise/sel')  
  , is     = require('utilise/is')  

module.exports = function once(scope) {
  var parent = scope.node ? scope : sel(scope)

  return accessorise(o, parent)

  function o(selector, data, key, before) {
    if (arguments.length == 1) return once(sall(parent)(selector))
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
},{"utilise/is":34,"utilise/proxy":55,"utilise/sall":62,"utilise/sel":63,"utilise/wrap":72}],50:[function(require,module,exports){
(function (global){
module.exports = require('utilise/client') ? /* istanbul ignore next */ window : global
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"utilise/client":9}],51:[function(require,module,exports){
module.exports = function parse(d){
  return d && JSON.parse(d)
}
},{}],52:[function(require,module,exports){
(function (process){
var log = require('utilise/log')('[perf]')
  , client = require('utilise/client')

module.exports =  function perf(fn) {
  var start = client ? performance.now() : process.hrtime()
  fn()
  var diff = client ? performance.now() - start : process.hrtime(start)
  !client && (diff = (diff[0]*1e3 + diff[1]/1e6))
  return log(fn.name, diff, 'ms'), diff
}
}).call(this,require('_process'))
},{"_process":45,"utilise/client":9,"utilise/log":41}],53:[function(require,module,exports){
module.exports = function prepend(v) {
  return function(d){
    return v+d
  }
}
},{}],54:[function(require,module,exports){
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
},{}],55:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function proxy(fn, ret, ctx){ 
  return function(){
    var result = fn.apply(ctx || this, arguments)
    return is.fn(ret) ? ret.call(ctx || this, result) : ret || result
  }
}
},{"utilise/is":34}],56:[function(require,module,exports){
module.exports = function push(arr){
  return function(d){
    return arr.push(d), arr
  }
}

},{}],57:[function(require,module,exports){
module.exports = function raw(selector, doc){
  var prefix = !doc && document.head.createShadowRoot ? 'html /deep/ ' : ''
  return (doc ? doc : document).querySelector(prefix+selector)
}
},{}],58:[function(require,module,exports){
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
},{}],59:[function(require,module,exports){
module.exports = function remove(k, v) {
  return function(d, i, a) {
    !v ? (d == k)    && a.splice(i,1)
       : (d[k] == v) && a.splice(i,1)
  }
}
},{}],60:[function(require,module,exports){
module.exports = function replace(from, to){
  return function(d){
    return d.replace(from, to)
  }
}
},{}],61:[function(require,module,exports){
var is = require('utilise/is')
  , body = require('utilise/body')
  , first = require('utilise/first')
  , values = require('utilise/values')

module.exports = function resourcify(ripple){
  return function(d) {
    var o = {}
      , names = d ? d.split(' ') : []

    return   names.length == 0 ? undefined
         :   names.length == 1 ? body(ripple)(first(names))
         : ( names.map(function(d) { return o[d] = body(ripple)(d) })
           , values(o).some(is.falsy) ? undefined : o 
           )
  }
}
},{"utilise/body":6,"utilise/first":22,"utilise/is":34,"utilise/values":70}],62:[function(require,module,exports){
var sel = require('utilise/sel')

module.exports = function sall(scope){
  var parent = !scope ? d3
             : scope.node ? scope 
             : sel(scope)
  return function(selector){
    return parent.selectAll(selector)
  }
}
},{"utilise/sel":63}],63:[function(require,module,exports){
module.exports = function sel(){
  return d3.select.apply(this, arguments)
}
},{}],64:[function(require,module,exports){
module.exports = function sort(fn){
  return function(arr){
    return arr.sort(fn)
  }
}

},{}],65:[function(require,module,exports){
module.exports = function split(delimiter){
  return function(d){
    return d.split(delimiter)
  }
}

},{}],66:[function(require,module,exports){
var is = require('utilise/is') 

module.exports = function str(d){
  return d === 0 ? '0'
       : !d ? ''
       : is.fn(d) ? '' + d
       : is.obj(d) ? JSON.stringify(d)
       : String(d)
}
},{"utilise/is":34}],67:[function(require,module,exports){
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
require('./owner').resourcify = require('./resourcify.js')
require('./owner').sall = require('./sall.js')
require('./owner').sel = require('./sel.js')
require('./owner').sort = require('./sort.js')
require('./owner').split = require('./split.js')
require('./owner').str = require('./str.js')
require('./owner').to = require('./to.js')
require('./owner').unique = require('./unique.js')
require('./owner').values = require('./values.js')
require('./owner').wait = require('./wait.js')
require('./owner').wrap = require('./wrap.js')
require('./owner').za = require('./za.js')

},{"./all.js":1,"./append.js":2,"./args.js":3,"./attr.js":4,"./az.js":5,"./body.js":6,"./by.js":7,"./chainable.js":8,"./client.js":9,"./clone.js":10,"./colorfill.js":11,"./copy.js":12,"./datum.js":13,"./debounce.js":14,"./def.js":15,"./el.js":16,"./emitterify.js":17,"./err.js":18,"./extend.js":19,"./falsy.js":20,"./filter.js":21,"./first.js":22,"./flatten.js":23,"./fn.js":24,"./from.js":25,"./grep.js":26,"./group.js":27,"./gt.js":28,"./has.js":29,"./header.js":30,"./identity.js":31,"./includes.js":32,"./inherit.js":33,"./is.js":34,"./join.js":35,"./key.js":36,"./keys.js":37,"./last.js":38,"./link.js":39,"./lo.js":40,"./log.js":41,"./lt.js":42,"./mo.js":43,"./noop.js":46,"./not.js":47,"./nullify.js":48,"./once.js":49,"./owner":50,"./owner.js":50,"./parse.js":51,"./perf.js":52,"./prepend.js":53,"./promise.js":54,"./proxy.js":55,"./push.js":56,"./raw.js":57,"./rebind.js":58,"./remove.js":59,"./replace.js":60,"./resourcify.js":61,"./sall.js":62,"./sel.js":63,"./sort.js":64,"./split.js":65,"./str.js":66,"./to.js":68,"./unique.js":69,"./values.js":70,"./wait.js":71,"./wrap.js":72,"./za.js":73}],68:[function(require,module,exports){
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
},{}],69:[function(require,module,exports){
module.exports = function unique(matched, value, i){
  if (i === 0) matched = [matched]
  if (!~matched.indexOf(value)) matched.push(value)
  return matched
}

},{}],70:[function(require,module,exports){
var keys = require('utilise/keys')
  , from = require('utilise/from')

module.exports = function values(o) {
  return !o ? [] : keys(o).map(from(o))
}
},{"utilise/from":25,"utilise/keys":37}],71:[function(require,module,exports){
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
},{}],72:[function(require,module,exports){
module.exports = function wrap(d){
  return function(){
    return d
  }
}
},{}],73:[function(require,module,exports){
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

},{"utilise/key":36}]},{},[67])(67)
});