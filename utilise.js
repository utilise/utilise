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

      return fn.apply(ctx || this, a)
    }
  }
}
},{"is":5,"to":6}],5:[function(require,module,exports){
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
var key = require('key')

module.exports = function body(ripple){
  return function(name){
    return key([name, 'body'].join('.'))(ripple.resources)
  }
}
},{"key":10}],10:[function(require,module,exports){
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
},{"is":11,"str":12}],11:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],12:[function(require,module,exports){
var is = require('is') 

module.exports = function str(d){
  return d === 0 ? '0'
       : !d ? ''
       : is.fn(d) ? '' + d
       : is.obj(d) ? JSON.stringify(d)
       : String(d)
}
},{"is":13}],13:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],14:[function(require,module,exports){

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
var key = require('key')
  , is  = require('is')

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
},{"is":17,"key":18}],17:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],18:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"is":19,"str":20}],19:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],20:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":21}],21:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],22:[function(require,module,exports){
module.exports = function chainable(fn) {
  return function(){
    return fn.apply(this, arguments), fn
  }
}
},{}],23:[function(require,module,exports){
module.exports = typeof window != 'undefined'
},{}],24:[function(require,module,exports){
var parse = require('parse')
  , str = require('str')
  , is = require('is')

module.exports = function clone(d) {
  return !is.fn(d) 
       ? parse(str(d))
       : d
}

},{"is":25,"parse":26,"str":27}],25:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],26:[function(require,module,exports){
module.exports = function parse(d){
  return d && JSON.parse(d)
}
},{}],27:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":28}],28:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],29:[function(require,module,exports){
var client = require('client')
  , colors = !client && require('colors')
  , has = require('has')
  , is = require('is')

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


},{"client":30,"colors":14,"has":31,"is":32}],30:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],31:[function(require,module,exports){
module.exports = function has(o, k) {
  return k in o
}
},{}],32:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],33:[function(require,module,exports){
module.exports = function copy(from, to){ 
  return function(d){ 
    return to[d] = from[d], d
  }
}
},{}],34:[function(require,module,exports){
var sel = require('sel')

module.exports = function datum(node){
  return sel(node).datum()
}
},{"sel":35}],35:[function(require,module,exports){
module.exports = function sel(){
  return d3.select.apply(this, arguments)
}
},{}],36:[function(require,module,exports){
var is = require('is')

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
},{"is":37}],37:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],38:[function(require,module,exports){
var has = require('has')

module.exports = function def(o, p, v, w){
  !has(o, p) && Object.defineProperty(o, p, { value: v, writable: w })
  return o[p]
}

},{"has":39}],39:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],40:[function(require,module,exports){
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
},{"attr":41,"prepend":43,"replace":44,"split":45}],41:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7,"is":42}],42:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],43:[function(require,module,exports){
module.exports = function prepend(v) {
  return function(d){
    return v+d
  }
}
},{}],44:[function(require,module,exports){
module.exports = function replace(from, to){
  return function(d){
    return d.replace(from, to)
  }
}
},{}],45:[function(require,module,exports){
module.exports = function split(delimiter){
  return function(d){
    return d.split(delimiter)
  }
}

},{}],46:[function(require,module,exports){
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
},{"def":47,"err":49,"is":53,"keys":54,"not":55}],47:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38,"has":48}],48:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],49:[function(require,module,exports){
var owner = require('owner')
  , to = require('to')

module.exports = function err(prefix){
  return function(d){
    if (!owner.console || !console.error.apply) return d;
    var args = to.arr(arguments)
    args.unshift(prefix.red ? prefix.red : prefix)
    return console.error.apply(console, args), d
  }
}
},{"owner":50,"to":52}],50:[function(require,module,exports){
(function (global){
module.exports = require('client') ? /* istanbul ignore next */ window : global
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"client":51}],51:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],52:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],53:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],54:[function(require,module,exports){
module.exports = function keys(o) {
  return Object.keys(o || {})
}
},{}],55:[function(require,module,exports){
module.exports = function not(fn){
  return function(){
    return !fn.apply(this, arguments)
  }
}
},{}],56:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"dup":49,"owner":57,"to":59}],57:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"client":58,"dup":50}],58:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],59:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],60:[function(require,module,exports){
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
},{"copy":61,"is":62,"keys":63,"not":64}],61:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],62:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],63:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"dup":54}],64:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"dup":55}],65:[function(require,module,exports){
module.exports = function falsy(){
  return false
}
},{}],66:[function(require,module,exports){
module.exports = function first(d){
  return d[0]
}
},{}],67:[function(require,module,exports){
module.exports = function flatten(p,v){ 
  return (p = p || []), p.concat(v) 
}

},{}],68:[function(require,module,exports){
var is = require('is')

module.exports = function fn(candid){
  return is.fn(candid) ? candid
       : (new Function("return " + candid))()
}
},{"is":69}],69:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],70:[function(require,module,exports){
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
},{"datum":71,"key":73}],71:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34,"sel":72}],72:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],73:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"is":74,"str":75}],74:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],75:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":76}],76:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],77:[function(require,module,exports){
var to = require('to')
  , is = require('is')

module.exports = function grep(o, k, regex){
  var original = o[k] 
  o[k] = function(){ 
    var d = to.arr(arguments).filter(is.str).join(' ')
    return d.match(regex) && original.apply(this, arguments) 
  }
  return original
}
},{"is":78,"to":79}],78:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],79:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],80:[function(require,module,exports){
var client = require('client')
  , owner = require('owner')

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
},{"client":81,"owner":82}],81:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],82:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"client":83,"dup":50}],83:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],84:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],85:[function(require,module,exports){
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
},{"has":86}],86:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],87:[function(require,module,exports){
module.exports = function identity(d) {
  return d
}
},{}],88:[function(require,module,exports){
module.exports = function includes(pattern){
  return function(d){
    return ~d.indexOf(pattern)
  }
}
},{}],89:[function(require,module,exports){
var wrap = require('wrap')

module.exports = function inherit(l) {
  if (arguments.length > 1) return [l]

  return function(d) {
    return new Array((l||1)+1)
      .join('0')
      .split('')
      .map(wrap(d))
  }
}
},{"wrap":90}],90:[function(require,module,exports){
module.exports = function wrap(d){
  return function(){
    return d
  }
}
},{}],91:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],92:[function(require,module,exports){
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

},{"by":93,"clone":99,"key":104}],93:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16,"is":94,"key":95}],94:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],95:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"is":96,"str":97}],96:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],97:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":98}],98:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],99:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24,"is":100,"parse":101,"str":102}],100:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],101:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],102:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":103}],103:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],104:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"is":105,"str":106}],105:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],106:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":107}],107:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],108:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"is":109,"str":110}],109:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],110:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":111}],111:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],112:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"dup":54}],113:[function(require,module,exports){
module.exports =  function last(d) {
  return d[d.length-1]
}
},{}],114:[function(require,module,exports){
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
},{"attr":115,"raw":117}],115:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7,"is":116}],116:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],117:[function(require,module,exports){
module.exports = function raw(selector, doc){
  var prefix = !doc && document.head.createShadowRoot ? 'html /deep/ ' : ''
  return (doc ? doc : document).querySelector(prefix+selector)
}
},{}],118:[function(require,module,exports){
module.exports = function lo(d){
  return (d || '').toLowerCase()
}

},{}],119:[function(require,module,exports){
var is = require('is')
  , to = require('to')
  , owner = require('owner')

module.exports = function log(prefix){
  return function(d){
    if (!owner.console || !console.log.apply) return d;
    is.arr(arguments[2]) && (arguments[2] = arguments[2].length)
    var args = to.arr(arguments)
    args.unshift(prefix.grey ? prefix.grey : prefix)
    return console.log.apply(console, args), d
  }
}
},{"is":120,"owner":121,"to":123}],120:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],121:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"client":122,"dup":50}],122:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],123:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],124:[function(require,module,exports){
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
},{"owner":125}],125:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"client":126,"dup":50}],126:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],127:[function(require,module,exports){
module.exports = function noop(){}
},{}],128:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"dup":55}],129:[function(require,module,exports){
module.exports = function objectify(rows, by) {
  var o = {}, by = by || 'name'
  return rows.forEach(function(d){
    return o[d[by]] = d 
  }), o
}
},{}],130:[function(require,module,exports){
var proxy  = require('proxy')  
  , wrap   = require('wrap')  
  , sall   = require('sall')  
  , sel    = require('sel')  
  , is     = require('is')  

module.exports = function once(scope) {
  var parent = scope.node ? scope : sel(scope)
  return function o(selector, data, key, before) {
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

    ;['text', 'classed', 'html', 'attr', 'style', 'on'].map(function(op){
      fn[op] = proxy(els[op], wrap(fn), els)
    })

    return fn
  }
}

function push(arr) {
  return function(d){ 
    arr.push(this) 
  }
}
},{"is":131,"proxy":132,"sall":134,"sel":136,"wrap":137}],131:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],132:[function(require,module,exports){
var is = require('is')

module.exports = function proxy(fn, ret, ctx){ 
  return function(){
    var result = fn.apply(ctx || this, arguments)
    return is.fn(ret) ? ret(result) : ret || result
  }
}
},{"is":133}],133:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],134:[function(require,module,exports){
var sel = require('sel')

module.exports = function sall(scope){
  var parent = !scope ? d3
             : scope.node ? scope 
             : sel(scope)
  return function(selector){
    return parent.selectAll(selector)
  }
}
},{"sel":135}],135:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],136:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],137:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"dup":90}],138:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"client":139,"dup":50}],139:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],140:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],141:[function(require,module,exports){
(function (process){
var log = require('log')('[perf]')
  , client = require('client')

module.exports =  function perf(fn) {
  var start = client ? performance.now() : process.hrtime()
  fn()
  var diff = client ? performance.now() - start : process.hrtime(start)
  !client && (diff = (diff[0]*1e3 + diff[1]/1e6))
  return log(fn.name, diff, 'ms'), diff
}
}).call(this,require('_process'))
},{"_process":15,"client":142,"log":143}],142:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],143:[function(require,module,exports){
arguments[4][119][0].apply(exports,arguments)
},{"dup":119,"is":144,"owner":145,"to":147}],144:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],145:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"client":146,"dup":50}],146:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],147:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],148:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43}],149:[function(require,module,exports){
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
},{}],150:[function(require,module,exports){
arguments[4][132][0].apply(exports,arguments)
},{"dup":132,"is":151}],151:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],152:[function(require,module,exports){
arguments[4][117][0].apply(exports,arguments)
},{"dup":117}],153:[function(require,module,exports){
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
},{}],154:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],155:[function(require,module,exports){
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
},{"body":156,"first":161,"is":162,"values":163}],156:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9,"key":157}],157:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"is":158,"str":159}],158:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],159:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":160}],160:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],161:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"dup":66}],162:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],163:[function(require,module,exports){
var keys = require('keys')
  , from = require('from')

module.exports = function values(o) {
  return !o ? [] : keys(o).map(from(o))
}
},{"from":164,"keys":171}],164:[function(require,module,exports){
arguments[4][70][0].apply(exports,arguments)
},{"datum":165,"dup":70,"key":167}],165:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34,"sel":166}],166:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],167:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"is":168,"str":169}],168:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],169:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":170}],170:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],171:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"dup":54}],172:[function(require,module,exports){
arguments[4][134][0].apply(exports,arguments)
},{"dup":134,"sel":173}],173:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],174:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],175:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":176}],176:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],177:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],178:[function(require,module,exports){
module.exports = function unique(matched, value, i){
  if (i === 1) matched = [matched]
  if (!~matched.indexOf(value)) matched.push(value)
  return matched
}

},{}],179:[function(require,module,exports){
arguments[4][163][0].apply(exports,arguments)
},{"dup":163,"from":180,"keys":187}],180:[function(require,module,exports){
arguments[4][70][0].apply(exports,arguments)
},{"datum":181,"dup":70,"key":183}],181:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34,"sel":182}],182:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],183:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"is":184,"str":185}],184:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],185:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"is":186}],186:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],187:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"dup":54}],188:[function(require,module,exports){
arguments[4][90][0].apply(exports,arguments)
},{"dup":90}],189:[function(require,module,exports){
require('owner').all = require('all')
require('owner').append = require('append')
require('owner').args = require('args')
require('owner').attr = require('attr')
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
require('owner').first = require('first')
require('owner').flatten = require('flatten')
require('owner').fn = require('fn')
require('owner').from = require('from')
require('owner').grep = require('grep')
require('owner').group = require('group')
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
require('owner').proxy = require('proxy')
require('owner').raw = require('raw')
require('owner').rebind = require('rebind')
require('owner').replace = require('replace')
require('owner').resourcify = require('resourcify')
require('owner').sall = require('sall')
require('owner').sel = require('sel')
require('owner').str = require('str')
require('owner').to = require('to')
require('owner').unique = require('unique')
require('owner').values = require('values')
require('owner').wrap = require('wrap')

},{"all":1,"append":3,"args":4,"attr":7,"body":9,"by":16,"chainable":22,"client":23,"clone":24,"colorfill":29,"copy":33,"datum":34,"debounce":36,"def":38,"el":40,"emitterify":46,"err":56,"extend":60,"falsy":65,"first":66,"flatten":67,"fn":68,"from":70,"grep":77,"group":80,"has":84,"header":85,"identity":87,"includes":88,"inherit":89,"is":91,"join":92,"key":108,"keys":112,"last":113,"link":114,"lo":118,"log":119,"mo":124,"noop":127,"not":128,"objectify":129,"once":130,"owner":138,"parse":140,"perf":141,"prepend":148,"promise":149,"proxy":150,"raw":152,"rebind":153,"replace":154,"resourcify":155,"sall":172,"sel":174,"str":175,"to":177,"unique":178,"values":179,"wrap":188}]},{},[189])(189)
});