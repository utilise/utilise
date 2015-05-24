(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.utilise = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var to = require('to')

module.exports = function all(selector, doc){
  var prefix = !doc && document.head.createShadowRoot ? 'html /deep/ ' : ''
  return to.arr((doc || document).querySelectorAll(prefix+selector))
}
},{"to":2}],2:[function(require,module,exports){
module.exports = { 
  arr : toArray
}

function toArray(d){
  return Array.prototype.slice.call(d, 0)
}
},{}],3:[function(require,module,exports){
module.exports = function append(v) {
  return function(d){
    return d+v
  }
}
},{}],4:[function(require,module,exports){
var to = require('to')
  , is = require('is')

module.exports = function args(indices) {
  return function (fn, ctx) {
    return function(){
      var i = is.arr(indices) ? indices : [indices]
        , a = to.arr(arguments)
                .filter(function(d,x){ return is.in(i)(x) })

      return fn.apply(ctx || this, a), a[0]
    }
  }
}
},{"is":5,"to":6}],5:[function(require,module,exports){
module.exports = is
is.fn     = isFunction
is.str    = isString
is.num    = isNumber
is.obj    = isObject
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

function isString(d) {
  return typeof d == 'string'
}

function isNumber(d) {
  return typeof d == 'number'
}

function isObject(d) {
  return typeof d == 'object'
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
module.exports = { 
  arr : toArray
}

function toArray(d){
  return Array.prototype.slice.call(d, 0)
}
},{}],7:[function(require,module,exports){
var is = require('is')

module.exports = function attr(d, name, value) {
  d = d.node ? d.node() : d
  if (is.str(d)) return function(el){ return attr(el, d) }

  return arguments.length > 2 && value === false ? d.removeAttribute(name)
       : arguments.length > 2                    ? d.setAttribute(name, value)
       : d.attributes.getNamedItem(name) 
      && d.attributes.getNamedItem(name).value
}

},{"is":8}],8:[function(require,module,exports){
module.exports = { 
  fn     : isFunction
, str    : isString
, num    : isNumber
, obj    : isObject
, truthy : isTruthy
, falsy  : isFalsy
, arr    : isArray
, null   : isNull
, def    : isDef
, in     : isIn
}

function isFunction(d) {
  return typeof d == 'function'
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
    return ~set.indexOf(d)
  }
}
},{}],9:[function(require,module,exports){
module.exports = function base(o) {
  return function (k) {
    return o[k]
  }
}
},{}],10:[function(require,module,exports){
var key = require('key')

module.exports = function body(ripple){
  return function(name){
    return key([name, 'body'])(ripple.resources)
  }
}
},{"key":11}],11:[function(require,module,exports){
var is = require('is')

module.exports = function key(k, v){ 
  var set  = arguments.length > 1
  is.arr(k) && (k = k.join('.'))
  
  return function deep(o){
    var keys = k.split('.')
      , root = keys.shift()

    return !o ? undefined 
         : keys.length ? (set ? key(keys.join('.'), v)(o[root] ? o[root] : (o[root] = {}))
                              : key(keys.join('.'))(o[root] ? o[root] : (o[root] = {})))
                       : (set ? (o[k] = v)
                              :  o[k])
  }
}
},{"is":12}],12:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],13:[function(require,module,exports){
var key = require('key')

module.exports = function by(k, v){
  return function(o){
    var d = key(k)(o)
    return d && v && d.toLowerCase && v.toLowerCase 
      ? d.toLowerCase() === v.toLowerCase()
      : d == v
  }
}
},{"key":14}],14:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is":15}],15:[function(require,module,exports){
module.exports = { 
  fn     : isFunction
, str    : isString
, num    : isNumber
, obj    : isObject
, truthy : isTruthy
, falsy  : isFalsy
, arr    : isArray
, null   : isNull
, def    : isDef
, in     : isIn
}

function isFunction(d) {
  return typeof d == 'function'
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
},{}],16:[function(require,module,exports){
module.exports = function chainable(fn) {
  return function(){
    return fn.apply(this, arguments), fn
  }
}
},{}],17:[function(require,module,exports){
module.exports = typeof window != 'undefined'
},{}],18:[function(require,module,exports){
var client = require('client')

module.exports = colorfill()

function colorfill(){
  client && ['red', 'green', 'bold', 'grey'].forEach(function(color) {
    Object.defineProperty(String.prototype, color, {
      get: function () {
        return String(this)
      }
    })
  })
}

},{"client":19}],19:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],20:[function(require,module,exports){
module.exports = function copy(from, to){ 
  return function(d){ 
    return to[d] = from[d], d
  }
}
},{}],21:[function(require,module,exports){
var has = require('has')

module.exports = function def(o, p, v, w){
  !has(o, p) && Object.defineProperty(o, p, { value: v, writable: w })
  return o[p]
}

},{"has":22}],22:[function(require,module,exports){
module.exports = function has(o, k) {
  return o.hasOwnProperty(k)
}
},{}],23:[function(require,module,exports){
var err  = require('err')('emitterify')
  , keys = require('keys')
  , def  = require('def')
  , not  = require('not')
  
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

    if (ns) return invoke(li, ns, param || body), body

    for (var i = li.length; i >=0; i--)
      invoke(li, i, param || body)

    keys(li)
      .filter(not(isFinite))
      .filter(filter || Boolean)
      .map(function(n){ return invoke(li, n, param || body) })

    return body
  }

  function invoke(o, k, p){
    if (!o[k]) return
    try { o[k](p) } catch(e) { err(e) }
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
},{"def":24,"err":26,"keys":27,"not":28}],24:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21,"has":25}],25:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],26:[function(require,module,exports){
module.exports = function log(prefix){
  return function(d){
    return console.error.bind(console, ''.red ? prefix.red : prefix).apply(console, arguments), d
  }
}
},{}],27:[function(require,module,exports){
module.exports = function keys(o) {
  return Object.keys(o || {})
}
},{}],28:[function(require,module,exports){
module.exports = function not(fn){
  return function(){
    return !fn.apply(this, arguments)
  }
}
},{}],29:[function(require,module,exports){
module.exports = function err(prefix){
  return function(d){
    var args = [].slice.call(arguments, 0)
    args.unshift(''.red ? prefix.red : prefix)
    return console.error.apply(console, args), d
  }
}
},{}],30:[function(require,module,exports){
var is = require('is')
  , not = require('not')
  , keys = require('keys')
  , copy = require('copy')

module.exports = function extend(to){ 
  return function(from){
    keys(from)
      .filter(not(is.in(to)))
      .map(copy(from, to))

    return to
  }
}
},{"copy":31,"is":32,"keys":33,"not":34}],31:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],32:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],33:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],34:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],35:[function(require,module,exports){
module.exports = function first(d){
  return d[0]
}
},{}],36:[function(require,module,exports){
var is = require('is')

module.exports = function fn(candid){
  return is.fn(candid) ? candid
       : (new Function("return " + candid))()
}
},{"is":37}],37:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],38:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],39:[function(require,module,exports){
var has = require('has')

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
},{"has":40}],40:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],41:[function(require,module,exports){
module.exports = function identity(d) {
  return d
}
},{}],42:[function(require,module,exports){
module.exports = function includes(pattern){
  return function(d){
    return ~d.indexOf(pattern)
  }
}
},{}],43:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],44:[function(require,module,exports){
var is = require('is')

module.exports = function key(k, v){ 
  var set  = arguments.length > 1
  is.arr(k) ? (k = k.join('.'))
            : (k = String(k ? k : ''))

  return function deep(o){
    var keys = k.split('.')
      , root = keys.shift()

    return !o ? undefined 
         : !k ? o
         : keys.length ? (set ? key(keys.join('.'), v)(o[root] ? o[root] : (o[root] = {}))
                              : key(keys.join('.'))(o[root] ? o[root] : (o[root] = {})))
                       : (set ? (o[k] = v)
                              :  o[k])
  }
}
},{"is":45}],45:[function(require,module,exports){
module.exports = is
is.fn     = isFunction
is.str    = isString
is.num    = isNumber
is.obj    = isObject
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

function isString(d) {
  return typeof d == 'string'
}

function isNumber(d) {
  return typeof d == 'number'
}

function isObject(d) {
  return typeof d == 'object'
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
},{}],46:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],47:[function(require,module,exports){
module.exports =  function last(d) {
  return d[d.length-1]
}
},{}],48:[function(require,module,exports){
module.exports = function lo(d){
  return d.toLowerCase()
}

},{}],49:[function(require,module,exports){
var is = require('is')
  , to = require('to')

module.exports = function log(prefix){
  return function(d){
    is.arr(arguments[2]) && (arguments[2] = arguments[2].length)
    var args = to.arr(arguments)
    args.unshift(''.grey ? prefix.grey : prefix)
    return console.log.apply(console, args), d
  }
}
},{"is":50,"to":51}],50:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],51:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],52:[function(require,module,exports){
module.exports = function noop(){}
},{}],53:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],54:[function(require,module,exports){
module.exports = function objectify(rows, by) {
  var o = {}, by = by || 'name'
  return rows.forEach(function(d){
    return o[d[by]] = d 
  }), o
}
},{}],55:[function(require,module,exports){
(function (global){
module.exports = require('client') ? window : global
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"client":56}],56:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],57:[function(require,module,exports){
module.exports = function parse(d){
  return d && JSON.parse(d)
}
},{}],58:[function(require,module,exports){
module.exports = function prepend(v) {
  return function(d){
    return v+d
  }
}
},{}],59:[function(require,module,exports){
module.exports = function raw(selector, context){
  return (context ? context : document).querySelector(selector)
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
module.exports = function replace(from, to){
  return function(d){
    return d.replace(from, to)
  }
}
},{}],62:[function(require,module,exports){
var is = require('is')
  , body = require('body')
  , first = require('first')
  , values = require('values')

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
},{"body":63,"first":66,"is":67,"values":68}],63:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"key":64}],64:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is":65}],65:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],66:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],67:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],68:[function(require,module,exports){
var keys = require('keys')
  , base = require('base')

module.exports = function values(o) {
  return !o ? [] : keys(o).map(base(o))
}
},{"base":69,"keys":70}],69:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],70:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],71:[function(require,module,exports){
var is = require('is') 

module.exports = function str(d){
  return is.num(d) 
       ? String(d)
       : JSON.stringify(d)
}
},{"is":72}],72:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],73:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],74:[function(require,module,exports){
var keys = require('keys')
  , base = require('base')

module.exports = function values(o) {
  return !o ? [] : keys(o).map(base(o))
}
},{"base":75,"keys":76}],75:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],76:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],77:[function(require,module,exports){
require('owner').all = require('all')
require('owner').append = require('append')
require('owner').args = require('args')
require('owner').attr = require('attr')
require('owner').base = require('base')
require('owner').body = require('body')
require('owner').by = require('by')
require('owner').chainable = require('chainable')
require('owner').client = require('client')
require('owner').colorfill = require('colorfill')
require('owner').copy = require('copy')
require('owner').def = require('def')
require('owner').emitterify = require('emitterify')
require('owner').err = require('err')
require('owner').extend = require('extend')
require('owner').first = require('first')
require('owner').fn = require('fn')
require('owner').has = require('has')
require('owner').header = require('header')
require('owner').identity = require('identity')
require('owner').includes = require('includes')
require('owner').is = require('is')
require('owner').key = require('key')
require('owner').keys = require('keys')
require('owner').last = require('last')
require('owner').lo = require('lo')
require('owner').log = require('log')
require('owner').matches = require('by')
require('owner').noop = require('noop')
require('owner').not = require('not')
require('owner').objectify = require('objectify')
require('owner').owner = require('owner')
require('owner').parse = require('parse')
require('owner').prepend = require('prepend')
require('owner').raw = require('raw')
require('owner').rebind = require('rebind')
require('owner').replace = require('replace')
require('owner').resourcify = require('resourcify')
require('owner').str = require('str')
require('owner').to = require('to')
require('owner').values = require('values')

},{"all":1,"append":3,"args":4,"attr":7,"base":9,"body":10,"by":13,"chainable":16,"client":17,"colorfill":18,"copy":20,"def":21,"emitterify":23,"err":29,"extend":30,"first":35,"fn":36,"has":38,"header":39,"identity":41,"includes":42,"is":43,"key":44,"keys":46,"last":47,"lo":48,"log":49,"noop":52,"not":53,"objectify":54,"owner":55,"parse":57,"prepend":58,"raw":59,"rebind":60,"replace":61,"resourcify":62,"str":71,"to":73,"values":74}]},{},[77])(77)
});