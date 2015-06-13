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
  is.arr(k) ? (k = k.join('.'))
            : (k = String(k ? k : ''))

  return function deep(o){
    var keys = k.split('.')
      , root = keys.shift()

    return !o ? undefined 
         : !k ? o
         : keys.length ? (set ? key(keys.join('.'), v)(o[root] ? o[root] : (o[root] = {}))
                              : key(keys.join('.'))(o[root]))
                       : (set ? (o[k] = v)
                              :  o[k])
  }
}
},{"is":12}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){

},{}],14:[function(require,module,exports){
var key = require('key')

module.exports = function by(k, v){
  return function(o){
    var d = key(k)(o)
    return d && v && d.toLowerCase && v.toLowerCase 
      ? d.toLowerCase() === v.toLowerCase()
      : d == v
  }
}
},{"key":15}],15:[function(require,module,exports){
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
},{"is":16}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
module.exports = function chainable(fn) {
  return function(){
    return fn.apply(this, arguments), fn
  }
}
},{}],18:[function(require,module,exports){
module.exports = typeof window != 'undefined'
},{}],19:[function(require,module,exports){
var client = require('client')

module.exports = colorfill()

function colorfill(){
  client && ['red', 'green', 'bold', 'grey'].forEach(function(color) {
    ('')[color] !== '' && Object.defineProperty(String.prototype, color, {
      get: function () {
        return String(this)
      }
    })
  })
}

},{"client":20}],20:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],21:[function(require,module,exports){
module.exports = function copy(from, to){ 
  return function(d){ 
    return to[d] = from[d], d
  }
}
},{}],22:[function(require,module,exports){
var has = require('has')

module.exports = function def(o, p, v, w){
  !has(o, p) && Object.defineProperty(o, p, { value: v, writable: w })
  return o[p]
}

},{"has":23}],23:[function(require,module,exports){
module.exports = function has(o, k) {
  return o.hasOwnProperty(k)
}
},{}],24:[function(require,module,exports){
var err  = require('err')('[emitterify]')
  , keys = require('keys')
  , def  = require('def')
  , not  = require('not')
  , is   = require('is')
  
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
    try { o[k].apply(body, p) } catch(e) { err(e); throw e }
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
},{"def":25,"err":27,"is":28,"keys":29,"not":30}],25:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22,"has":26}],26:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],27:[function(require,module,exports){
module.exports = function log(prefix){
  return function(d){
    return console.error.bind(console, ''.red ? prefix.red : prefix).apply(console, arguments), d
  }
}
},{}],28:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],29:[function(require,module,exports){
module.exports = function keys(o) {
  return Object.keys(o || {})
}
},{}],30:[function(require,module,exports){
module.exports = function not(fn){
  return function(){
    return !fn.apply(this, arguments)
  }
}
},{}],31:[function(require,module,exports){
var owner = require('owner')

module.exports = function err(prefix){
  return function(d){
    if (!owner.console) return d;
    var args = [].slice.call(arguments, 0)
    args.unshift(''.red ? prefix.red : prefix)
    return console.error.apply(console, args), d
  }
}
},{"owner":32}],32:[function(require,module,exports){
(function (global){
module.exports = require('client') ? window : global
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"client":33}],33:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],34:[function(require,module,exports){
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
},{"copy":35,"is":36,"keys":37,"not":38}],35:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],36:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],37:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],38:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],39:[function(require,module,exports){
module.exports = function falsy(){
  return false
}
},{}],40:[function(require,module,exports){
module.exports = function file(name){
  return require('fs').readFileSync(name, { encoding:'utf8' })
}
},{"fs":13}],41:[function(require,module,exports){
module.exports = function first(d){
  return d[0]
}
},{}],42:[function(require,module,exports){
var is = require('is')

module.exports = function fn(candid){
  return is.fn(candid) ? candid
       : (new Function("return " + candid))()
}
},{"is":43}],43:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],44:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],45:[function(require,module,exports){
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
},{"has":46}],46:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],47:[function(require,module,exports){
module.exports = function identity(d) {
  return d
}
},{}],48:[function(require,module,exports){
module.exports = function includes(pattern){
  return function(d){
    return ~d.indexOf(pattern)
  }
}
},{}],49:[function(require,module,exports){
var identity = require('identity')

module.exports = function inherit(len) {
  return function(d) {
    return new Array((len||1)+1)
      .join('0')
      .split('')
      .map(identity.bind(0,d))
  }
}
},{"identity":50}],50:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],51:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],52:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is":53}],53:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],54:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],55:[function(require,module,exports){
module.exports =  function last(d) {
  return d[d.length-1]
}
},{}],56:[function(require,module,exports){
module.exports = function lo(d){
  return d.toLowerCase()
}

},{}],57:[function(require,module,exports){
var is = require('is')
  , to = require('to')
  , owner = require('owner')

module.exports = function log(prefix){
  return function(d){
    if (!owner.console) return d;
    is.arr(arguments[2]) && (arguments[2] = arguments[2].length)
    var args = to.arr(arguments)
    args.unshift(''.grey ? prefix.grey : prefix)
    return console.log.apply(console, args), d
  }
}
},{"is":58,"owner":59,"to":61}],58:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],59:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"client":60,"dup":32}],60:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],61:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],62:[function(require,module,exports){
var to = require('to')

module.exports = function mask() {
  var keys = to.arr(arguments)
  return function(o){
    var masked = {}
    keys.forEach(function(k){ masked[k] = o[k] })
    return masked
  }
}

},{"to":63}],63:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],64:[function(require,module,exports){
module.exports = function noop(){}
},{}],65:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],66:[function(require,module,exports){
module.exports = function objectify(rows, by) {
  var o = {}, by = by || 'name'
  return rows.forEach(function(d){
    return o[d[by]] = d 
  }), o
}
},{}],67:[function(require,module,exports){
var d3 = require('d3')
  , is = require('is')  

module.exports = function once(g, selector, data, before, key) {
  var g       = g.node ? g : d3.select(g)
    , classed = selector instanceof HTMLElement
                  ? selector.className
                  : selector.split('.').slice(1).join(' ')
    , type    = selector instanceof HTMLElement
                  ? function(){ return selector }
                  : selector.split('.')[0] || 'div'
    
  if (is.str(data)) (data = [data])
  if (is.obj(data) && !is.arr(data)) (data = [data])
  if (arguments.length == 2) data = [0]
  if (!data) data = []

  var el = g
    .selectAll(selector.toString())
    .data(data, key)

  el.once = function(s,d,b,k) { return once(el,s,d,b,k) }

  el.out = el.exit()
    .remove() 

  el.in = el.enter()
    .insert(type, before)
    .classed(classed, 1)

  return el
}

},{"d3":13,"is":68}],68:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],69:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"client":70,"dup":32}],70:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],71:[function(require,module,exports){
module.exports = function parse(d){
  return d && JSON.parse(d)
}
},{}],72:[function(require,module,exports){
module.exports = function prepend(v) {
  return function(d){
    return v+d
  }
}
},{}],73:[function(require,module,exports){
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

},{}],74:[function(require,module,exports){
module.exports = function raw(selector, context){
  return (context ? context : document).querySelector(selector)
}
},{}],75:[function(require,module,exports){
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
},{}],76:[function(require,module,exports){
module.exports = function replace(from, to){
  return function(d){
    return d.replace(from, to)
  }
}
},{}],77:[function(require,module,exports){
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
},{"body":78,"first":81,"is":82,"values":83}],78:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"key":79}],79:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is":80}],80:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],81:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"dup":41}],82:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],83:[function(require,module,exports){
var keys = require('keys')
  , base = require('base')

module.exports = function values(o) {
  return !o ? [] : keys(o).map(base(o))
}
},{"base":84,"keys":85}],84:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],85:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],86:[function(require,module,exports){
var is = require('is') 

module.exports = function str(d){
  return is.num(d) 
       ? String(d)
       : JSON.stringify(d)
}
},{"is":87}],87:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],88:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],89:[function(require,module,exports){
var keys = require('keys')
  , base = require('base')

module.exports = function values(o) {
  return !o ? [] : keys(o).map(base(o))
}
},{"base":90,"keys":91}],90:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],91:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],92:[function(require,module,exports){
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
require('owner').falsy = require('falsy')
require('owner').file = require('file')
require('owner').first = require('first')
require('owner').fn = require('fn')
require('owner').has = require('has')
require('owner').header = require('header')
require('owner').identity = require('identity')
require('owner').includes = require('includes')
require('owner').inherit = require('inherit')
require('owner').is = require('is')
require('owner').key = require('key')
require('owner').keys = require('keys')
require('owner').last = require('last')
require('owner').lo = require('lo')
require('owner').log = require('log')
require('owner').mask = require('mask')
require('owner').matches = require('by')
require('owner').noop = require('noop')
require('owner').not = require('not')
require('owner').objectify = require('objectify')
require('owner').once = require('once')
require('owner').owner = require('owner')
require('owner').parse = require('parse')
require('owner').prepend = require('prepend')
require('owner').promise = require('promise')
require('owner').raw = require('raw')
require('owner').rebind = require('rebind')
require('owner').replace = require('replace')
require('owner').resourcify = require('resourcify')
require('owner').str = require('str')
require('owner').to = require('to')
require('owner').values = require('values')

},{"all":1,"append":3,"args":4,"attr":7,"base":9,"body":10,"by":14,"chainable":17,"client":18,"colorfill":19,"copy":21,"def":22,"emitterify":24,"err":31,"extend":34,"falsy":39,"file":40,"first":41,"fn":42,"has":44,"header":45,"identity":47,"includes":48,"inherit":49,"is":51,"key":52,"keys":54,"last":55,"lo":56,"log":57,"mask":62,"noop":64,"not":65,"objectify":66,"once":67,"owner":69,"parse":71,"prepend":72,"promise":73,"raw":74,"rebind":75,"replace":76,"resourcify":77,"str":86,"to":88,"values":89}]},{},[92])(92)
});