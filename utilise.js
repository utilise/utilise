(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.utilise = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var is = require('utilise.is')

module.exports = function attr(d, name, value) {
  d = d.node ? d.node() : d
  if (is.str(d)) return function(el){ return attr(this.nodeName || this.node ? this : el, d) }

  return arguments.length > 2 && value === false ? d.removeAttribute(name)
       : arguments.length > 2                    ? d.setAttribute(name, value)
       : d.attributes.getNamedItem(name) 
      && d.attributes.getNamedItem(name).value
}

},{"utilise.is":2}],2:[function(require,module,exports){
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
    return  set.indexOf 
         ? ~set.indexOf(d)
         :  d in set
  }
}
},{}],3:[function(require,module,exports){
var key = require('utilise.key')

module.exports = function body(ripple){
  return function(name){
    return key([name, 'body'].join('.'))(ripple.resources)
  }
}
},{"utilise.key":4}],4:[function(require,module,exports){
var is = require('is')
  , str = require('str')

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
                                : (set ? key(keys.join('.'), v)(o[root] ? o[root] : (o[root] = {}))
                                       : key(keys.join('.'))(o[root]))

    function copy(d){
      key(d, key(d)(o))(masked)
    }
  }
}
},{"is":5,"str":6}],5:[function(require,module,exports){
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
    return  set.indexOf 
         ? ~set.indexOf(d)
         :  d in set
  }
}
},{}],6:[function(require,module,exports){
var is = require('is') 

module.exports = function str(d){
  return d === 0 ? '0'
       : !d ? ''
       : is.fn(d) ? '' + d
       : is.obj(d) ? JSON.stringify(d)
       : String(d)
}
},{"is":7}],7:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],8:[function(require,module,exports){
var key = require('utilise.key')
  , is  = require('utilise.is')

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
},{"utilise.is":9,"utilise.key":10}],9:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],10:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4,"is":11,"str":12}],11:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],12:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6,"is":13}],13:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],14:[function(require,module,exports){
var parse = require('utilise.parse')
  , str = require('utilise.str')
  , is = require('utilise.is')

module.exports = function clone(d) {
  return !is.fn(d) 
       ? parse(str(d))
       : d
}

},{"utilise.is":15,"utilise.parse":16,"utilise.str":17}],15:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],16:[function(require,module,exports){
module.exports = function parse(d){
  return d && JSON.parse(d)
}
},{}],17:[function(require,module,exports){
var is = require('is') 

module.exports = function str(d){
  return d === 0 ? '0'
       : !d ? ''
       : is.fn(d) ? '' + d
       : is.obj(d) ? JSON.stringify(d)
       : String(d)
}
},{"is":18}],18:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],19:[function(require,module,exports){
module.exports = function copy(from, to){ 
  return function(d){ 
    return to[d] = from[d], d
  }
}
},{}],20:[function(require,module,exports){
var sel = require('utilise.sel')

module.exports = function datum(node){
  return sel(node).datum()
}
},{"utilise.sel":21}],21:[function(require,module,exports){
module.exports = function sel(){
  return d3.select.apply(this, arguments)
}
},{}],22:[function(require,module,exports){
var has = require('utilise.has')

module.exports = function def(o, p, v, w){
  !has(o, p) && Object.defineProperty(o, p, { value: v, writable: w })
  return o[p]
}

},{"utilise.has":23}],23:[function(require,module,exports){
module.exports = function has(o, k) {
  return k in o
}
},{}],24:[function(require,module,exports){
var owner = require('utilise.owner')
  , to = require('utilise.to')

module.exports = function err(prefix){
  return function(d){
    if (!owner.console || !console.error.apply) return d;
    var args = to.arr(arguments)
    args.unshift(prefix.red ? prefix.red : prefix)
    return console.error.apply(console, args), d
  }
}
},{"utilise.owner":25,"utilise.to":27}],25:[function(require,module,exports){
(function (global){
module.exports = require('client') ? /* istanbul ignore next */ window : global
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"client":26}],26:[function(require,module,exports){
module.exports = typeof window != 'undefined'
},{}],27:[function(require,module,exports){
module.exports = { 
  arr : toArray
}

function toArray(d){
  return Array.prototype.slice.call(d, 0)
}
},{}],28:[function(require,module,exports){
module.exports = function first(d){
  return d[0]
}
},{}],29:[function(require,module,exports){
var datum = require('utilise.datum')
  , key = require('utilise.key')

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
},{"utilise.datum":30,"utilise.key":32}],30:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20,"utilise.sel":31}],31:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],32:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4,"is":33,"str":34}],33:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],34:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6,"is":35}],35:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],36:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],37:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],38:[function(require,module,exports){
var is = require('utilise.is')
  , str = require('utilise.str')

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
                                : (set ? key(keys.join('.'), v)(o[root] ? o[root] : (o[root] = {}))
                                       : key(keys.join('.'))(o[root]))

    function copy(d){
      key(d, key(d)(o))(masked)
    }
  }
}
},{"utilise.is":39,"utilise.str":40}],39:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],40:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17,"is":41}],41:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],42:[function(require,module,exports){
module.exports = function keys(o) {
  return Object.keys(o || {})
}
},{}],43:[function(require,module,exports){
var is = require('utilise.is')
  , to = require('utilise.to')
  , owner = require('utilise.owner')

module.exports = function log(prefix){
  return function(d){
    if (!owner.console || !console.log.apply) return d;
    is.arr(arguments[2]) && (arguments[2] = arguments[2].length)
    var args = to.arr(arguments)
    args.unshift(prefix.grey ? prefix.grey : prefix)
    return console.log.apply(console, args), d
  }
}
},{"utilise.is":44,"utilise.owner":45,"utilise.to":47}],44:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],45:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"client":46,"dup":25}],46:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],47:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],48:[function(require,module,exports){
module.exports = function not(fn){
  return function(){
    return !fn.apply(this, arguments)
  }
}
},{}],49:[function(require,module,exports){
(function (global){
module.exports = require('utilise.client') ? /* istanbul ignore next */ window : global
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"utilise.client":50}],50:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],51:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],52:[function(require,module,exports){
module.exports = function prepend(v) {
  return function(d){
    return v+d
  }
}
},{}],53:[function(require,module,exports){
var is = require('utilise.is')

module.exports = function proxy(fn, ret, ctx){ 
  return function(){
    var result = fn.apply(ctx || this, arguments)
    return is.fn(ret) ? ret(result) : ret || result
  }
}
},{"utilise.is":54}],54:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],55:[function(require,module,exports){
module.exports = function raw(selector, doc){
  var prefix = !doc && document.head.createShadowRoot ? 'html /deep/ ' : ''
  return (doc ? doc : document).querySelector(prefix+selector)
}
},{}],56:[function(require,module,exports){
module.exports = function replace(from, to){
  return function(d){
    return d.replace(from, to)
  }
}
},{}],57:[function(require,module,exports){
var sel = require('utilise.sel')

module.exports = function sall(scope){
  var parent = !scope ? d3
             : scope.node ? scope 
             : sel(scope)
  return function(selector){
    return parent.selectAll(selector)
  }
}
},{"utilise.sel":58}],58:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],59:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],60:[function(require,module,exports){
var is = require('utilise.is') 

module.exports = function str(d){
  return d === 0 ? '0'
       : !d ? ''
       : is.fn(d) ? '' + d
       : is.obj(d) ? JSON.stringify(d)
       : String(d)
}
},{"utilise.is":61}],61:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],62:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],63:[function(require,module,exports){
module.exports = function split(delimiter){
  return function(d){
    return d.split(delimiter)
  }
}

},{}],64:[function(require,module,exports){
var keys = require('utilise.keys')
  , from = require('utilise.from')

module.exports = function values(o) {
  return !o ? [] : keys(o).map(from(o))
}
},{"utilise.from":65,"utilise.keys":71}],65:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29,"utilise.datum":66,"utilise.key":68}],66:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20,"utilise.sel":67}],67:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],68:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38,"utilise.is":69,"utilise.str":70}],69:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],70:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60,"utilise.is":69}],71:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],72:[function(require,module,exports){
module.exports = function wrap(d){
  return function(){
    return d
  }
}
},{}],73:[function(require,module,exports){
var to = require('utilise/to')

module.exports = function all(selector, doc){
  var prefix = !doc && document.head.createShadowRoot ? 'html /deep/ ' : ''
  return to.arr((doc || document).querySelectorAll(prefix+selector))
}
},{"utilise/to":166}],74:[function(require,module,exports){
module.exports = function append(v) {
  return function(d){
    return d+v
  }
}
},{}],75:[function(require,module,exports){
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
},{"utilise/is":152,"utilise/to":166}],76:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function attr(d, name, value) {
  d = d.node ? d.node() : d
  if (is.str(d)) return function(el){ return attr(this.nodeName || this.node ? this : el, d) }

  return arguments.length > 2 && value === false ? d.removeAttribute(name)
       : arguments.length > 2                    ? d.setAttribute(name, value)
       : d.attributes.getNamedItem(name) 
      && d.attributes.getNamedItem(name).value
}

},{"utilise/is":152}],77:[function(require,module,exports){
var key = require('utilise/key')

module.exports = function body(ripple){
  return function(name){
    return key([name, 'body'].join('.'))(ripple.resources)
  }
}
},{"utilise/key":153}],78:[function(require,module,exports){
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
},{"utilise/is":152,"utilise/key":153}],79:[function(require,module,exports){
module.exports = function chainable(fn) {
  return function(){
    return fn.apply(this, arguments), fn
  }
}
},{}],80:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],81:[function(require,module,exports){
var parse = require('utilise/parse')
  , str = require('utilise/str')
  , is = require('utilise/is')

module.exports = function clone(d) {
  return !is.fn(d) 
       ? parse(str(d))
       : d
}

},{"utilise/is":152,"utilise/parse":158,"utilise/str":165}],82:[function(require,module,exports){
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


},{"colors":113,"utilise/client":143,"utilise/has":151,"utilise/is":152}],83:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],84:[function(require,module,exports){
var sel = require('utilise/sel')

module.exports = function datum(node){
  return sel(node).datum()
}
},{"utilise/sel":164}],85:[function(require,module,exports){
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
},{"utilise/is":152}],86:[function(require,module,exports){
var has = require('utilise/has')

module.exports = function def(o, p, v, w){
  !has(o, p) && Object.defineProperty(o, p, { value: v, writable: w })
  return o[p]
}

},{"utilise/has":151}],87:[function(require,module,exports){
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
},{"utilise/attr":140,"utilise/prepend":159,"utilise/replace":162,"utilise/split":63}],88:[function(require,module,exports){
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
    try { o[k].apply(body, p) } catch(e) { err(e, e.stack)  }
    o[k].once && (isFinite(k) ? o.splice(k, 1) : delete o[k])
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
},{"utilise/def":147,"utilise/err":148,"utilise/is":152,"utilise/keys":154,"utilise/not":156}],89:[function(require,module,exports){
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
},{"utilise/owner":157,"utilise/to":166}],90:[function(require,module,exports){
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
},{"utilise/copy":145,"utilise/is":152,"utilise/keys":154,"utilise/not":156}],91:[function(require,module,exports){
module.exports = function falsy(){
  return false
}
},{}],92:[function(require,module,exports){
module.exports = function filter(fn){
  return function(arr){
    return arr.filter(fn)
  }
}

},{}],93:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],94:[function(require,module,exports){
module.exports = function flatten(p,v){ 
  return (p = p || []), p.concat(v) 
}

},{}],95:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function fn(candid){
  return is.fn(candid) ? candid
       : (new Function("return " + candid))()
}
},{"utilise/is":152}],96:[function(require,module,exports){
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
},{"utilise/datum":146,"utilise/key":153}],97:[function(require,module,exports){
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
},{"utilise/is":152,"utilise/to":166}],98:[function(require,module,exports){
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
},{"utilise/client":143,"utilise/owner":157}],99:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],100:[function(require,module,exports){
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
},{"utilise/has":151}],101:[function(require,module,exports){
module.exports = function identity(d) {
  return d
}
},{}],102:[function(require,module,exports){
module.exports = function includes(pattern){
  return function(d){
    return ~d.indexOf(pattern)
  }
}
},{}],103:[function(require,module,exports){
var wrap = require('utilise/wrap')

module.exports = function inherit(l) {
  if (arguments.length > 1) return [l]

  return function(d) {
    return new Array((l||1)+1)
      .join('0')
      .split('')
      .map(wrap(d))
  }
}
},{"utilise/wrap":168}],104:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],105:[function(require,module,exports){
var clone = require('utilise/clone')
  , key = require('utilise/key')
  , by = require('utilise/by')

module.exports = function join(left, right){
  return function(d){
    var array = right.split('.')
      , table = array.shift()
      , field = array.join('.')

    d[left] = ripple(table)
      .filter(by('id', clone(d[left])))
      .map(key(field))
      .pop() || {}

    return d
  }
}

},{"utilise/by":142,"utilise/clone":144,"utilise/key":153}],106:[function(require,module,exports){
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
                                : (set ? key(keys.join('.'), v)(o[root] ? o[root] : (o[root] = {}))
                                       : key(keys.join('.'))(o[root]))

    function copy(d){
      key(d, key(d)(o))(masked)
    }
  }
}
},{"utilise/is":152,"utilise/str":165}],107:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],108:[function(require,module,exports){
module.exports =  function last(d) {
  return d[d.length-1]
}
},{}],109:[function(require,module,exports){
var attr = require('utilise/attr')
  , raw = require('utilise/raw')
  
module.exports = link

function link(from, to){
  var key = from + '|' + to
    , from = destructure(from)
    , to = destructure(to)
    , links = link.links = link.links || {}

  if (!from.el || !to.el) return;
  if (links[key]) return;
  links[key] = true
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
},{"utilise/attr":140,"utilise/raw":161}],110:[function(require,module,exports){
module.exports = function lo(d){
  return (d || '').toLowerCase()
}

},{}],111:[function(require,module,exports){
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
},{"utilise/is":152,"utilise/owner":157,"utilise/to":166}],112:[function(require,module,exports){
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
},{"utilise/owner":157}],113:[function(require,module,exports){

},{}],114:[function(require,module,exports){
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
            currentQueue[queueIndex].run();
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

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],115:[function(require,module,exports){
module.exports = function noop(){}
},{}],116:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],117:[function(require,module,exports){
module.exports = function objectify(rows, by) {
  var o = {}, by = by || 'name'
  return rows.forEach(function(d){
    return o[d[by]] = d 
  }), o
}
},{}],118:[function(require,module,exports){
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
                  ? wrap(elSelector)
                  : elSelector.split('.')[0] || 'div'
      
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

function push(arr) {
  return function(d){ 
    arr.push(this) 
  }
}

function accessorise(o, original){
  ['text', 'classed', 'html', 'attr', 'style', 'on', 'each', 'node', 'datum'].map(function(op){
    o[op] = proxy(original[op], wrap(o), original)
  })

  return o
}
},{"utilise/is":152,"utilise/proxy":160,"utilise/sall":163,"utilise/sel":164,"utilise/wrap":168}],119:[function(require,module,exports){
(function (global){
module.exports = require('utilise/client') ? /* istanbul ignore next */ window : global
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"utilise/client":143}],120:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],121:[function(require,module,exports){
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
},{"_process":114,"utilise/client":143,"utilise/log":155}],122:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],123:[function(require,module,exports){
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
},{}],124:[function(require,module,exports){
var is = require('utilise/is')

module.exports = function proxy(fn, ret, ctx){ 
  return function(){
    var result = fn.apply(ctx || this, arguments)
    return is.fn(ret) ? ret(result) : ret || result
  }
}
},{"utilise/is":152}],125:[function(require,module,exports){
module.exports = function push(arr){
  return function(d){
    return arr.push(d), arr
  }
}

},{}],126:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"dup":55}],127:[function(require,module,exports){
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
},{}],128:[function(require,module,exports){
arguments[4][56][0].apply(exports,arguments)
},{"dup":56}],129:[function(require,module,exports){
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
},{"utilise/body":141,"utilise/first":149,"utilise/is":152,"utilise/values":167}],130:[function(require,module,exports){
var sel = require('utilise/sel')

module.exports = function sall(scope){
  var parent = !scope ? d3
             : scope.node ? scope 
             : sel(scope)
  return function(selector){
    return parent.selectAll(selector)
  }
}
},{"utilise/sel":164}],131:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],132:[function(require,module,exports){
module.exports = function sort(fn){
  return function(arr){
    return arr.sort(fn)
  }
}

},{}],133:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"dup":63}],134:[function(require,module,exports){
var is = require('utilise/is') 

module.exports = function str(d){
  return d === 0 ? '0'
       : !d ? ''
       : is.fn(d) ? '' + d
       : is.obj(d) ? JSON.stringify(d)
       : String(d)
}
},{"utilise/is":152}],135:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],136:[function(require,module,exports){
module.exports = function unique(matched, value, i){
  if (i === 1) matched = [matched]
  if (!~matched.indexOf(value)) matched.push(value)
  return matched
}

},{}],137:[function(require,module,exports){
var keys = require('utilise/keys')
  , from = require('utilise/from')

module.exports = function values(o) {
  return !o ? [] : keys(o).map(from(o))
}
},{"utilise/from":150,"utilise/keys":154}],138:[function(require,module,exports){
arguments[4][72][0].apply(exports,arguments)
},{"dup":72}],139:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],140:[function(require,module,exports){
module.exports = require('attr')
},{"attr":1}],141:[function(require,module,exports){
module.exports = require('body')
},{"body":3}],142:[function(require,module,exports){
module.exports = require('by')
},{"by":8}],143:[function(require,module,exports){
module.exports = require('client')
},{"client":139}],144:[function(require,module,exports){
module.exports = require('clone')
},{"clone":14}],145:[function(require,module,exports){
module.exports = require('copy')
},{"copy":19}],146:[function(require,module,exports){
module.exports = require('datum')
},{"datum":20}],147:[function(require,module,exports){
module.exports = require('def')
},{"def":22}],148:[function(require,module,exports){
module.exports = require('err')
},{"err":24}],149:[function(require,module,exports){
module.exports = require('first')
},{"first":28}],150:[function(require,module,exports){
module.exports = require('from')
},{"from":29}],151:[function(require,module,exports){
module.exports = require('has')
},{"has":36}],152:[function(require,module,exports){
module.exports = require('is')
},{"is":37}],153:[function(require,module,exports){
module.exports = require('key')
},{"key":38}],154:[function(require,module,exports){
module.exports = require('keys')
},{"keys":42}],155:[function(require,module,exports){
module.exports = require('log')
},{"log":43}],156:[function(require,module,exports){
module.exports = require('not')
},{"not":48}],157:[function(require,module,exports){
module.exports = require('owner')
},{"owner":49}],158:[function(require,module,exports){
module.exports = require('parse')
},{"parse":51}],159:[function(require,module,exports){
module.exports = require('prepend')
},{"prepend":52}],160:[function(require,module,exports){
module.exports = require('proxy')
},{"proxy":53}],161:[function(require,module,exports){
module.exports = require('raw')
},{"raw":55}],162:[function(require,module,exports){
module.exports = require('replace')
},{"replace":56}],163:[function(require,module,exports){
module.exports = require('sall')
},{"sall":57}],164:[function(require,module,exports){
module.exports = require('sel')
},{"sel":59}],165:[function(require,module,exports){
module.exports = require('str')
},{"str":60}],166:[function(require,module,exports){
module.exports = require('to')
},{"to":62}],167:[function(require,module,exports){
module.exports = require('values')
},{"values":64}],168:[function(require,module,exports){
module.exports = require('wrap')
},{"wrap":72}],169:[function(require,module,exports){
require('./owner').all = require('./all.js')
require('./owner').append = require('./append.js')
require('./owner').args = require('./args.js')
require('./owner').attr = require('./attr.js')
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
require('./owner').mo = require('./mo.js')
require('./owner').noop = require('./noop.js')
require('./owner').not = require('./not.js')
require('./owner').objectify = require('./objectify.js')
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
require('./owner').wrap = require('./wrap.js')

},{"./all.js":73,"./append.js":74,"./args.js":75,"./attr.js":76,"./body.js":77,"./by.js":78,"./chainable.js":79,"./client.js":80,"./clone.js":81,"./colorfill.js":82,"./copy.js":83,"./datum.js":84,"./debounce.js":85,"./def.js":86,"./el.js":87,"./emitterify.js":88,"./err.js":89,"./extend.js":90,"./falsy.js":91,"./filter.js":92,"./first.js":93,"./flatten.js":94,"./fn.js":95,"./from.js":96,"./grep.js":97,"./group.js":98,"./has.js":99,"./header.js":100,"./identity.js":101,"./includes.js":102,"./inherit.js":103,"./is.js":104,"./join.js":105,"./key.js":106,"./keys.js":107,"./last.js":108,"./link.js":109,"./lo.js":110,"./log.js":111,"./mo.js":112,"./noop.js":115,"./not.js":116,"./objectify.js":117,"./once.js":118,"./owner":119,"./owner.js":119,"./parse.js":120,"./perf.js":121,"./prepend.js":122,"./promise.js":123,"./proxy.js":124,"./push.js":125,"./raw.js":126,"./rebind.js":127,"./replace.js":128,"./resourcify.js":129,"./sall.js":130,"./sel.js":131,"./sort.js":132,"./split.js":133,"./str.js":134,"./to.js":135,"./unique.js":136,"./values.js":137,"./wrap.js":138}]},{},[169])(169)
});