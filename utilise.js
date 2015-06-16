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
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],7:[function(require,module,exports){
var is = require('is')

module.exports = function attr(d, name, value) {
  d = d.node ? d.node() : d
  if (is.str(d)) return function(el){ return attr(this.nodeName || this.node ? this : el, d) }

  return arguments.length > 2 && value === false ? d.removeAttribute(name)
       : arguments.length > 2                    ? d.setAttribute(name, value)
       : d.attributes.getNamedItem(name) 
      && d.attributes.getNamedItem(name).value
}

},{"is":8}],8:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],9:[function(require,module,exports){
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
                       : (set ? ((o[k] = is.fn(v) ? v(o[k]) : v), o)
                              :  o[k])
  }
}
},{"is":12}],12:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],13:[function(require,module,exports){

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
var key = require('key')

module.exports = function by(k, v){
  return function(o){
    var d = key(k)(o)
    return d && v && d.toLowerCase && v.toLowerCase 
      ? d.toLowerCase() === v.toLowerCase()
      : d == v
  }
}
},{"key":16}],16:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is":17}],17:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],18:[function(require,module,exports){
module.exports = function chainable(fn) {
  return function(){
    return fn.apply(this, arguments), fn
  }
}
},{}],19:[function(require,module,exports){
module.exports = typeof window != 'undefined'
},{}],20:[function(require,module,exports){
var parse = require('parse')
  , str = require('str')
  , is = require('is')

module.exports = function clone(d) {
  return !is.fn(d) 
       ? parse(str(d))
       : d
}

},{"is":21,"parse":22,"str":23}],21:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],22:[function(require,module,exports){
module.exports = function parse(d){
  return d && JSON.parse(d)
}
},{}],23:[function(require,module,exports){
var is = require('is') 

module.exports = function str(d){
  return is.num(d) 
       ? String(d)
       : JSON.stringify(d)
}
},{"is":24}],24:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],25:[function(require,module,exports){
var client = require('client')
  , colors = require('colors')

module.exports = colorfill()

function colorfill(){
  /* istanbul ignore next */
  client && ['red', 'green', 'bold', 'grey', 'strip'].forEach(function(color) {
    ('')[color] !== '' && Object.defineProperty(String.prototype, color, {
      get: function () {
        return String(this)
      }
    })
  })
}

},{"client":26,"colors":13}],26:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],27:[function(require,module,exports){
module.exports = function copy(from, to){ 
  return function(d){ 
    return to[d] = from[d], d
  }
}
},{}],28:[function(require,module,exports){
var sel = require('sel')

module.exports = function datum(node){
  return sel(node).datum()
}
},{"sel":29}],29:[function(require,module,exports){
module.exports = function sel(){
  return d3.select.apply(this, arguments)
}
},{}],30:[function(require,module,exports){
module.exports = function debounce(fn){
  var wait = 100, pending

  return function(){
    var ctx = this, args = arguments
    pending && clearTimeout(pending)
    pending = setTimeout(function(){ fn.apply(ctx, args) }, wait)
  }
}
},{}],31:[function(require,module,exports){
var has = require('has')

module.exports = function def(o, p, v, w){
  !has(o, p) && Object.defineProperty(o, p, { value: v, writable: w })
  return o[p]
}

},{"has":32}],32:[function(require,module,exports){
module.exports = function has(o, k) {
  return k in o
}
},{}],33:[function(require,module,exports){
var attr = require('attr')
  , split = require('split')
  , replace = require('replace')
  , prepend = require('prepend')

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
},{"attr":34,"prepend":36,"replace":37,"split":38}],34:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7,"is":35}],35:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],36:[function(require,module,exports){
module.exports = function prepend(v) {
  return function(d){
    return v+d
  }
}
},{}],37:[function(require,module,exports){
module.exports = function replace(from, to){
  return function(d){
    return d.replace(from, to)
  }
}
},{}],38:[function(require,module,exports){
module.exports = function split(delimiter){
  return function(d){
    return d.split(delimiter)
  }
}

},{}],39:[function(require,module,exports){
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
},{"def":40,"err":42,"is":45,"keys":46,"not":47}],40:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31,"has":41}],41:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],42:[function(require,module,exports){
var owner = require('owner')
  , to = require('to')

module.exports = function err(prefix){
  return function(d){
    if (!owner.console) return d;
    var args = to.arr(arguments)
    args.unshift(prefix.red ? prefix.red : prefix)
    return console.error.apply(console, args), d
  }
}
},{"owner":43,"to":136}],43:[function(require,module,exports){
(function (global){
module.exports = require('client') ? /* istanbul ignore next */ window : global
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"client":44}],44:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],45:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],46:[function(require,module,exports){
module.exports = function keys(o) {
  return Object.keys(o || {})
}
},{}],47:[function(require,module,exports){
module.exports = function not(fn){
  return function(){
    return !fn.apply(this, arguments)
  }
}
},{}],48:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42,"owner":49,"to":136}],49:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"client":50,"dup":43}],50:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],51:[function(require,module,exports){
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
},{"copy":52,"is":53,"keys":54,"not":55}],52:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],53:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],54:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],55:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],56:[function(require,module,exports){
module.exports = function falsy(){
  return false
}
},{}],57:[function(require,module,exports){
module.exports = function file(name){
  return require('fs').readFileSync(name, { encoding:'utf8' })
}
},{"fs":13}],58:[function(require,module,exports){
module.exports = function first(d){
  return d[0]
}
},{}],59:[function(require,module,exports){
var is = require('is')

module.exports = function fn(candid){
  return is.fn(candid) ? candid
       : (new Function("return " + candid))()
}
},{"is":60}],60:[function(require,module,exports){
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
},{}],61:[function(require,module,exports){
var datum = require('datum')
  , key = require('key')

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
},{"datum":62,"key":64}],62:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"sel":63}],63:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],64:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is":65}],65:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],66:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],67:[function(require,module,exports){
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
},{"has":68}],68:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],69:[function(require,module,exports){
module.exports = function identity(d) {
  return d
}
},{}],70:[function(require,module,exports){
module.exports = function includes(pattern){
  return function(d){
    return ~d.indexOf(pattern)
  }
}
},{}],71:[function(require,module,exports){
var identity = require('identity')

module.exports = function inherit(len) {
  return function(d) {
    return new Array((len||1)+1)
      .join('0')
      .split('')
      .map(identity.bind(0,d))
  }
}
},{"identity":72}],72:[function(require,module,exports){
arguments[4][69][0].apply(exports,arguments)
},{"dup":69}],73:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],74:[function(require,module,exports){
var clone = require('clone')
  , key = require('key')
  , by = require('by')

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

},{"by":75,"clone":78,"key":83}],75:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"key":76}],76:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is":77}],77:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],78:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20,"is":79,"parse":80,"str":81}],79:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],80:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],81:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23,"is":82}],82:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],83:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is":84}],84:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],85:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is":86}],86:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],87:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],88:[function(require,module,exports){
module.exports =  function last(d) {
  return d[d.length-1]
}
},{}],89:[function(require,module,exports){
var attr = require('attr')
  , raw = require('raw')
  
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
},{"attr":90,"raw":92}],90:[function(require,module,exports){
var is = require('is')

module.exports = function attr(d, name, value) {
  d = d.node ? d.node() : d
  if (is.str(d)) return function(el){ return attr(this.nodeName || this.node ? this : el, d) }

  return arguments.length > 2 && value === false ? d.removeAttribute(name)
       : arguments.length > 2                    ? d.setAttribute(name, value)
       : d.attributes.getNamedItem(name) 
      && d.attributes.getNamedItem(name).value
}

},{"is":91}],91:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],92:[function(require,module,exports){
module.exports = function raw(selector, doc){
  var prefix = !doc && document.head.createShadowRoot ? 'html /deep/ ' : ''
  return (doc ? doc : document).querySelector(prefix+selector)
}
},{}],93:[function(require,module,exports){
module.exports = function lo(d){
  return d.toLowerCase()
}

},{}],94:[function(require,module,exports){
var is = require('is')
  , to = require('to')
  , owner = require('owner')

module.exports = function log(prefix){
  return function(d){
    if (!owner.console) return d;
    is.arr(arguments[2]) && (arguments[2] = arguments[2].length)
    var args = to.arr(arguments)
    args.unshift(prefix.grey ? prefix.grey : prefix)
    return console.log.apply(console, args), d
  }
}
},{"is":95,"owner":96,"to":98}],95:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],96:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"client":97,"dup":43}],97:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],98:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],99:[function(require,module,exports){
var to = require('to')

module.exports = function mask() {
  var keys = to.arr(arguments)
  return function(o){
    var masked = {}
    keys.forEach(function(k){ masked[k] = o[k] })
    return masked
  }
}

},{"to":100}],100:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],101:[function(require,module,exports){
var owner = require('owner')

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
},{"owner":102}],102:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"client":103,"dup":43}],103:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],104:[function(require,module,exports){
module.exports = function noop(){}
},{}],105:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],106:[function(require,module,exports){
module.exports = function objectify(rows, by) {
  var o = {}, by = by || 'name'
  return rows.forEach(function(d){
    return o[d[by]] = d 
  }), o
}
},{}],107:[function(require,module,exports){
var is = require('is')  

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

},{"is":108}],108:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],109:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"client":110,"dup":43}],110:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],111:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],112:[function(require,module,exports){
(function (process){
var log = require('log')('[perf]')
  , client = require('client')

module.exports =  function perf(fn) {
  var start = client ? performance.now() : process.hrtime()
  fn()
  var diff = client ? performance.now() - start : process.hrtime(start)
  !client && (diff = (diff[0] * 1e9 + diff[1])/1000)
  return log(diff, 'ms', fn.name), diff
}
}).call(this,require('_process'))
},{"_process":14,"client":113,"log":114}],113:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],114:[function(require,module,exports){
var is = require('is')
  , to = require('to')
  , owner = require('owner')

module.exports = function log(prefix){
  return function(d){
    if (!owner.console) return d;
    is.arr(arguments[2]) && (arguments[2] = arguments[2].length)
    var args = to.arr(arguments)
    args.unshift(prefix.grey ? prefix.grey : prefix)
    return console.log.apply(console, args), d
  }
}
},{"is":115,"owner":116,"to":118}],115:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"dup":60}],116:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"client":117,"dup":43}],117:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],118:[function(require,module,exports){
module.exports = { 
  arr : toArray
}

function toArray(d){
  return Array.prototype.slice.call(d, 0)
}
},{}],119:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],120:[function(require,module,exports){
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

},{}],121:[function(require,module,exports){
module.exports = function raw(selector, doc){
  var prefix = !doc && document.head.createShadowRoot ? 'html /deep/ ' : ''
  return (doc ? doc : document).querySelector(prefix+selector)
}
},{}],122:[function(require,module,exports){
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
},{}],123:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],124:[function(require,module,exports){
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
},{"body":125,"first":128,"is":129,"values":130}],125:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"key":126}],126:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"is":127}],127:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],128:[function(require,module,exports){
arguments[4][58][0].apply(exports,arguments)
},{"dup":58}],129:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],130:[function(require,module,exports){
var keys = require('keys')
  , base = require('base')

module.exports = function values(o) {
  return !o ? [] : keys(o).map(base(o))
}
},{"base":131,"keys":132}],131:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],132:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],133:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],134:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23,"is":135}],135:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],136:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],137:[function(require,module,exports){
arguments[4][130][0].apply(exports,arguments)
},{"base":138,"dup":130,"keys":139}],138:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],139:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],140:[function(require,module,exports){
module.exports = function wrap(d){
  return function(){
    return d
  }
}
},{}],141:[function(require,module,exports){
require('owner').all = require('all')
require('owner').append = require('append')
require('owner').args = require('args')
require('owner').attr = require('attr')
require('owner').base = require('base')
require('owner').body = require('body')
require('owner').by = require('by')
require('owner').chainable = require('chainable')
require('owner').client = require('client')
require('owner').clone = require('clone')
require('owner').colorfill = require('colorfill')
require('owner').copy = require('copy')
require('owner').datum = require('datum')
require('owner').debounce = require('debounce')
require('owner').def = require('def')
require('owner').el = require('el')
require('owner').emitterify = require('emitterify')
require('owner').err = require('err')
require('owner').extend = require('extend')
require('owner').falsy = require('falsy')
require('owner').file = require('file')
require('owner').first = require('first')
require('owner').fn = require('fn')
require('owner').from = require('from')
require('owner').has = require('has')
require('owner').header = require('header')
require('owner').identity = require('identity')
require('owner').includes = require('includes')
require('owner').inherit = require('inherit')
require('owner').is = require('is')
require('owner').join = require('join')
require('owner').key = require('key')
require('owner').keys = require('keys')
require('owner').last = require('last')
require('owner').link = require('link')
require('owner').lo = require('lo')
require('owner').log = require('log')
require('owner').mask = require('mask')
require('owner').matches = require('by')
require('owner').mo = require('mo')
require('owner').noop = require('noop')
require('owner').not = require('not')
require('owner').objectify = require('objectify')
require('owner').once = require('once')
require('owner').owner = require('owner')
require('owner').parse = require('parse')
require('owner').perf = require('perf')
require('owner').prepend = require('prepend')
require('owner').promise = require('promise')
require('owner').raw = require('raw')
require('owner').rebind = require('rebind')
require('owner').replace = require('replace')
require('owner').resourcify = require('resourcify')
require('owner').sel = require('sel')
require('owner').str = require('str')
require('owner').to = require('to')
require('owner').values = require('values')
require('owner').wrap = require('wrap')

},{"all":1,"append":3,"args":4,"attr":7,"base":9,"body":10,"by":15,"chainable":18,"client":19,"clone":20,"colorfill":25,"copy":27,"datum":28,"debounce":30,"def":31,"el":33,"emitterify":39,"err":48,"extend":51,"falsy":56,"file":57,"first":58,"fn":59,"from":61,"has":66,"header":67,"identity":69,"includes":70,"inherit":71,"is":73,"join":74,"key":85,"keys":87,"last":88,"link":89,"lo":93,"log":94,"mask":99,"mo":101,"noop":104,"not":105,"objectify":106,"once":107,"owner":109,"parse":111,"perf":112,"prepend":119,"promise":120,"raw":121,"rebind":122,"replace":123,"resourcify":124,"sel":133,"str":134,"to":136,"values":137,"wrap":140}]},{},[141])(141)
});