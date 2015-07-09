# Lean JavaScript Utilities as Micro-libraries 

* This is not another pure functional utility library. These are just a set of common useful patterns that have evolved working with JS.

* Unfortunately the existing popular libraries (Underscore, Lodash, Ramda, Trine, is, etc) don't result in readable code that is easy to reason about. Instead of putting the data in the first, second, third argument or context variable, this library favours lambda's (partially applied functions) that complement the native Array operations, not compete with them.

For a flavour of what I mean, see:

```js
// clean all js files in current dir, except reserved, logging before deletion
fs.readdirSync(__dirname)
  .filter(includes('js'))
  .filter(not(is.in(core)))
  .map(prepend(__dirname+'/'))
  .map(log('deleting'))
  .map(fs.unlinkSync)
```

```js
// from mutation observer, redraw all added nodes that are custom elements
mutations
  .map(key('addedNodes'))
  .map(to.arr)
  .reduce(flatten)
  .filter(by('nodeName', includes('-')))
  .map(ripple.draw)
```

* Each function is in it's own repo. This library just has an automated link to all of them. This has a few benefits:

  * You can `npm i utilise` and finally write imports like `<org>/<repo>` in each file.
  * You don't have to make up esoteric names due to lack of `<org>/<repo>` in npm.
  * You can use `utilise.js` to import everything (in your application).
  * You don't have to load a 0.5MB utility library just to use one function.
  * You can be a lot smarter with dead code elimination, even if you include the base file (but not use everything).

* There is no spraying your code with `_.` everywhere, since these functions are largely first-class additions to the language that make your code a lot more fluent. 

* These are mostly stable, a few new ones may still need experimenting with to get the API right. 

* Each micro-library is only just a few lines. 

* Each micro-library has 100% tests. See badges below.

* All browsers (IE >= 9) + node/iojs are supported. Tests are run on real browsers using popper (to be open-sourced soon).

* There is no polyfilling done here. Recommend using polyfill.io where needed. Some libraries will fail tests (like promise) which wraps native functions like `Promise`, unless you shim first.

# API Reference

Please also refer to the respective `test.js` for more cases and examples.

## [![Coverage Status](https://coveralls.io/repos/utilise/all/badge.svg?branch=master)](https://coveralls.io/r/utilise/all?branch=master) [![Build](https://api.travis-ci.org/utilise/all.svg)](https://travis-ci.org/utilise/all) all

Select all elements based on a CSS selector, piercing shadow boundaries if the browser supports it.
 
```js
all('li.class')
```
 
Narrow search space by also passing in a node

```js
all('li.class', ul)
```

## [![Coverage Status](https://coveralls.io/repos/utilise/append/badge.svg?branch=master)](https://coveralls.io/r/utilise/append?branch=master) [![Build](https://api.travis-ci.org/utilise/append.svg)](https://travis-ci.org/utilise/append) append

Append something to a string

```js
['lorem', 'ipsum']
  .map(append('-foo')) // returns ['lorem-foo', 'ipsum-foo']
```

## [![Coverage Status](https://coveralls.io/repos/utilise/args/badge.svg?branch=master)](https://coveralls.io/r/utilise/args?branch=master) [![Build](https://api.travis-ci.org/utilise/args.svg)](https://travis-ci.org/utilise/args) args

Cherry-pick arguments to pass to function by index. This is useful when iterating a list, and invoking a function which may be confused if passed the index and array arguments.

```js
['lorem.txt', 'ipsum.txt']
  .map(args(0)(fs.createWriteStream))
```

This would fail without `args` since the second argument (index) would try to be read as the encoding.

You can pick out more than one argument using an array instead of a number.

## [![Coverage Status](https://coveralls.io/repos/utilise/attr/badge.svg?branch=master)](https://coveralls.io/r/utilise/attr?branch=master) [![Build](https://api.travis-ci.org/utilise/attr.svg)](https://travis-ci.org/utilise/attr) attr

Get or set value of element attribute.

```js
attr('key')(el)          // returns value for attribute key
attr('key', 'value')(el) // adds [key=value]
attr('key', false)(el)   // removes attribute key
```

## [![Coverage Status](https://coveralls.io/repos/utilise/body/badge.svg?branch=master)](https://coveralls.io/r/utilise/body?branch=master) [![Build](https://api.travis-ci.org/utilise/body.svg)](https://travis-ci.org/utilise/body) body

Get the value of a resource from a ripple instance

```js
body(ripple)('users')
```

This is used internally to avoid any type-specific convienience defaults. Always returns undefined if the resource does not exist. You should probably use `ripple('resource')` to get the value of a resource in your application.

## [![Coverage Status](https://coveralls.io/repos/utilise/by/badge.svg?branch=master)](https://coveralls.io/r/utilise/by?branch=master) [![Build](https://api.travis-ci.org/utilise/by.svg)](https://travis-ci.org/utilise/by) by

Checks if a property matches a value

```js
users = [ { name: 'foo' }, { name: 'bar' } ]
users
  .filter(by('name', 'foo'))
```

If the second value parameter is a function, you can run custom logic against each property (default is `==`)

```js
nodes
  .filter(by('nodeName', isCustomElement)) // checks if has '-' in tag
```

It is common to sometimes see filtering empty values via `.filter(Boolean)`. If only one parameter is given, it filters out objects that do not have a value for the property.

```js
nodes
  .filter(by('prop')) // removes object that do not have a value for prop
```

## [![Coverage Status](https://coveralls.io/repos/utilise/chainable/badge.svg?branch=master)](https://coveralls.io/r/utilise/chainable?branch=master) [![Build](https://api.travis-ci.org/utilise/chainable.svg)](https://travis-ci.org/utilise/chainable) chainable

Takes a function, and returns a new function that evaluates the original function and also returns it again ignoring what the evaluated function returns

```js
ripple('key', value)                // this normally registers a resource, and returns the value
ripple.resource = chainable(ripple) // ripple.resource now registers a resource, but returns ripple again

ripple 
  .resource('foo', 'bar')
  .resource('lorem', 'ipsum')
```

NB: I think this will be deprecated in favour of the more [generic proxy function](https://github.com/utilise/utilise#--proxy) that is used to alter return values

## [![Coverage Status](https://coveralls.io/repos/utilise/client/badge.svg?branch=master)](https://coveralls.io/r/utilise/client?branch=master) [![Build](https://api.travis-ci.org/utilise/client.svg)](https://travis-ci.org/utilise/client) client

Simple variable: Am I on the server or browser?

```js
// browser
client == true

// server
client == false
```

Useful for isomorphic apps/libs, and also deadcode elimination. 

## [![Coverage Status](https://coveralls.io/repos/utilise/clone/badge.svg?branch=master)](https://coveralls.io/r/utilise/clone?branch=master) [![Build](https://api.travis-ci.org/utilise/clone.svg)](https://travis-ci.org/utilise/clone) clone

Returns a new deep copy of an object

```js
copied = clone(original)
```

## [![Coverage Status](https://coveralls.io/repos/utilise/colorfill/badge.svg?branch=master)](https://coveralls.io/r/utilise/colorfill?branch=master) [![Build](https://api.travis-ci.org/utilise/colorfill.svg)](https://travis-ci.org/utilise/colorfill) colorfill

Adds color to strings, standardising behaviour across server/client

```js
require('colorfill')

'foo'.red  // server, returns string in red
'foo'.red  // client, returns string
```

## [![Coverage Status](https://coveralls.io/repos/utilise/copy/badge.svg?branch=master)](https://coveralls.io/r/utilise/copy?branch=master) [![Build](https://api.travis-ci.org/utilise/copy.svg)](https://travis-ci.org/utilise/copy) copy

Copies properties from one object to another

```js
keys(from)
  .filter(not(is.in(private)))
  .map(copy(from, to))
```

## [![Coverage Status](https://coveralls.io/repos/utilise/datum/badge.svg?branch=master)](https://coveralls.io/r/utilise/datum?branch=master) [![Build](https://api.travis-ci.org/utilise/datum.svg)](https://travis-ci.org/utilise/datum) datum

Returns the D3 datum for a node. Useful in lists as you cannot `d3.select(node).datum()`

```js
nodes
  .map(datum)
```

## [![Coverage Status](https://coveralls.io/repos/utilise/debounce/badge.svg?branch=master)](https://coveralls.io/r/utilise/debounce?branch=master) [![Build](https://api.travis-ci.org/utilise/debounce.svg)](https://travis-ci.org/utilise/debounce) debounce

Returns a debounced function. Specify time in ms, or defaults to 100ms.

```js
debounced = debounce(fn)
// or
debounced = debounce(200)(fn)
```

## [![Coverage Status](https://coveralls.io/repos/utilise/def/badge.svg?branch=master)](https://coveralls.io/r/utilise/def?branch=master) [![Build](https://api.travis-ci.org/utilise/def.svg)](https://travis-ci.org/utilise/def) def

Defines a property, if does not already exist, returning the value

```js
def(object, prop, value[, writable])  // returns value
```

## [![Coverage Status](https://coveralls.io/repos/utilise/el/badge.svg?branch=master)](https://coveralls.io/r/utilise/el?branch=master) [![Build](https://api.travis-ci.org/utilise/el.svg)](https://travis-ci.org/utilise/el) el

Creates a node from a CSS selector

```js
el(div.foo.bar[lorem=ipsum]) // returns <el class="foo bar" lorem="ipsum" />
```

## [![Coverage Status](https://coveralls.io/repos/utilise/emitterify/badge.svg?branch=master)](https://coveralls.io/r/utilise/emitterify?branch=master) [![Build](https://api.travis-ci.org/utilise/emitterify.svg)](https://travis-ci.org/utilise/emitterify) emitterify

Enhance any object with `.on`, `.once` and `.emit`

```js
var o = emitterify({}) 
o.on('event')             // get listeners for event
o.on('event', fn)         // set listener on arbitrary event
o.once('event', fn)       // set listener that is only called once
o.on('event.ns', fn)      // set listener for event.namespace, unique listener per namespace
o.emit('event', payload)  // emit event with optional payload
o.emit('event', [array])  // emit event with optional multiple arguments
```

## [![Coverage Status](https://coveralls.io/repos/utilise/err/badge.svg?branch=master)](https://coveralls.io/r/utilise/err?branch=master) [![Build](https://api.travis-ci.org/utilise/err.svg)](https://travis-ci.org/utilise/err) err

Lightweight scoped version of `console.error` with a prefix, useful for per module identification

```js
err = err('[module/prefix]')
err('something went wrong!') // [module/prefix] something went wrong
```

## [![Coverage Status](https://coveralls.io/repos/utilise/extend/badge.svg?branch=master)](https://coveralls.io/r/utilise/extend?branch=master) [![Build](https://api.travis-ci.org/utilise/extend.svg)](https://travis-ci.org/utilise/extend) extend

Extends an object with properties from another, not overwriting properties by default

```js
to = { foo: 1 }
from = { foo: 2, bar: 3 }
extend(to)(from)  // to == { foo: 1, bar: 3 }
```

## [![Coverage Status](https://coveralls.io/repos/utilise/falsy/badge.svg?branch=master)](https://coveralls.io/r/utilise/falsy?branch=master) [![Build](https://api.travis-ci.org/utilise/falsy.svg)](https://travis-ci.org/utilise/falsy) falsy

Function that returns false

```js
shouldIContinue = falsy // when executed, returns false
```

## [![Coverage Status](https://coveralls.io/repos/utilise/file/badge.svg?branch=master)](https://coveralls.io/r/utilise/file?branch=master) [![Build](https://api.travis-ci.org/utilise/file.svg)](https://travis-ci.org/utilise/file) file

Reads and returns a file. Server only.

```js
var template = file('template.html')
```

## [![Coverage Status](https://coveralls.io/repos/utilise/first/badge.svg?branch=master)](https://coveralls.io/r/utilise/first?branch=master) [![Build](https://api.travis-ci.org/utilise/first.svg)](https://travis-ci.org/utilise/first) first

Returns first element in array

```js
first(array)  // returns array[0]
```

## [![Coverage Status](https://coveralls.io/repos/utilise/flatten/badge.svg?branch=master)](https://coveralls.io/r/utilise/flatten?branch=master) [![Build](https://api.travis-ci.org/utilise/flatten.svg)](https://travis-ci.org/utilise/flatten) flatten

Flattens a 2D array

```js
twoD = [[1], [2], [3]]
oneD = twoD.reduce(flatten)  // [1, 2, 3]
```

## [![Coverage Status](https://coveralls.io/repos/utilise/fn/badge.svg?branch=master)](https://coveralls.io/r/utilise/fn?branch=master) [![Build](https://api.travis-ci.org/utilise/fn.svg)](https://travis-ci.org/utilise/fn) fn

Turns a function as a string into a real function

```js
foo = 'function(){ console.log("Hi!") }'
foo = fn(foo)   // returns function(){ console.log("foo") }
foo()           // logs out "Hi!"
```

## [![Coverage Status](https://coveralls.io/repos/utilise/from/badge.svg?branch=master)](https://coveralls.io/r/utilise/from?branch=master) [![Build](https://api.travis-ci.org/utilise/from.svg)](https://travis-ci.org/utilise/from) from

Looks up and returns a property from an object. Useful for converting foreign keys to matching records.

```js
users = [
  { name: 'foo', city: 1 }
, { name: 'bar', city: 2 }
, { name: 'baz', city: 1 }
]

cities: { 1: 'London', 2: 'New York', 3: 'Paris' }

// get a unique list of cities users live in
users
  .map(key('city'))
  .map(from(cities))
  .reduce(unique)     // returns [ 'London', 'New York' ]
```

`from.parent` returns the value of a property from the parent datum. Useful if you generate a fixed number of columns, whose values depend on the parent. 

```js
processes = [ 
  { name: 'chrome', pid: '123', cpu: '50%' } 
, { name: 'safari', pid: '456', cpu: '50%' } 
]

// generate a list of rows, each with three columns
once('tr', processes)
  ('td', ['name', 'pid', 'cpu'])
    .text(from.parent)
```

```html
<tr>
  <td>chrome</td><td>123</td></td>50%</td>
  <td>safari</td><td>456</td></td>50%</td>
</tr>
```

In general you should try to pass each element the data it needs and not reach outside of its own scope.

## [![Coverage Status](https://coveralls.io/repos/utilise/group/badge.svg?branch=master)](https://coveralls.io/r/utilise/group?branch=master) [![Build](https://api.travis-ci.org/utilise/group.svg)](https://travis-ci.org/utilise/group) group

Grouped logging using groupCollapsed/groupEnd if it exists, or simple start/end demarcation logs using asterisk if not.

```js
group('category', fn)
```

## [![Coverage Status](https://coveralls.io/repos/utilise/grep/badge.svg?branch=master)](https://coveralls.io/r/utilise/grep?branch=master) [![Build](https://api.travis-ci.org/utilise/grep.svg)](https://travis-ci.org/utilise/grep) grep

Conditionally executes a function depending on the regex against its arguments. Returns the original unfiltered function. Useful for higher order modules to conditionally filter out logs of many smaller modules unobtrusively.

```js
// filter out all internal logs from ripple (i.e. that don't start with "[ri/")
unfiltered = grep(console, 'log', /^(?!.*\[ri\/)/)
```

## [![Coverage Status](https://coveralls.io/repos/utilise/has/badge.svg?branch=master)](https://coveralls.io/r/utilise/has?branch=master) [![Build](https://api.travis-ci.org/utilise/has.svg)](https://travis-ci.org/utilise/has) has

Checks if object has property using `in` keyword

```js
has(object, 'prop')
```

## [![Coverage Status](https://coveralls.io/repos/utilise/header/badge.svg?branch=master)](https://coveralls.io/r/utilise/header?branch=master) [![Build](https://api.travis-ci.org/utilise/header.svg)](https://travis-ci.org/utilise/header) header

Extract the value of a header from a ripple resource

```js
header('content-type')(resource) // returns for example 'application/javascript'
```

Or if a second parameter is set, check for equality

```js
// filter to get all data resources
resources 
  .filter(header('content-type', 'application/data'))
```

## [![Coverage Status](https://coveralls.io/repos/utilise/identity/badge.svg?branch=master)](https://coveralls.io/r/utilise/identity?branch=master) [![Build](https://api.travis-ci.org/utilise/identity.svg)](https://travis-ci.org/utilise/identity) identity

Identity function, returns what it is passed in

```js
identity(5) // returns 5
```

## [![Coverage Status](https://coveralls.io/repos/utilise/includes/badge.svg?branch=master)](https://coveralls.io/r/utilise/includes?branch=master) [![Build](https://api.travis-ci.org/utilise/includes.svg)](https://travis-ci.org/utilise/includes) includes

Checks if string or array contains the pattern or element (uses indexOf common to strings and arrays)

```js
// filter down to all javascript files
files
  .filter(includes('.js'))
```

## [![Coverage Status](https://coveralls.io/repos/utilise/inherit/badge.svg?branch=master)](https://coveralls.io/r/utilise/inherit?branch=master) [![Build](https://api.travis-ci.org/utilise/inherit.svg)](https://travis-ci.org/utilise/inherit) inherit

Inherits parent data

```js
once('div', { name: 'sth' })
  ('li', inherit)
    ('span', key('name'))
      .text(String)
```

```html
<div>
  <li>
    <span>sth</span>
  </li>
</div>
```

If a number is provided, returns an array of inherited parent datum

```js
once('div', { name: 'sth' })
  ('li', inherit(3))
    ('span', key('name'))
      .text(String)
```

```html
<div>
  <li>
    <span>sth</span>
    <span>sth</span>
    <span>sth</span>
  </li>
</div>
```

## [![Coverage Status](https://coveralls.io/repos/utilise/is/badge.svg?branch=master)](https://coveralls.io/r/utilise/is?branch=master) [![Build](https://api.travis-ci.org/utilise/is.svg)](https://travis-ci.org/utilise/is) is

Various basic flavours of checking

```js
is(v)(d)      // equality d == v
is.fn         // function
is.str        // string
is.num        // number
is.obj        // object (includes arrays)
is.lit        // object (excludes arrays)
is.bol        // boolean
is.truthy     // truthy
is.falsy      // falsy
is.arr        // array
is.null       // null
is.def        // undefined
is.in(set)(d) // checks if d in set (string, array or object)
```

## [![Coverage Status](https://coveralls.io/repos/utilise/join/badge.svg?branch=master)](https://coveralls.io/r/utilise/join?branch=master) [![Build](https://api.travis-ci.org/utilise/join.svg)](https://travis-ci.org/utilise/join) join

Replace a foreign key property with the full record or a value from the record

```js
// doctors == [ { name: nick, grade: 1 .. }, .. ]
// ripple('grades') == [ { id: 1, name: 'FY1' }, { id: 2, name: 'SHO' }, .. ]

doctors
  .map(join('shift', 'shifts'))
  .map(join('speciality', 'specialities'))
  .map(join('grade', 'grades.name'))
  .map(join('hospital', 'hospitals.location'))
```

If the second parameter is a string, it uses that as the ripple resource to look in. You can also use a primitive array outside of a ripple context.

## [![Coverage Status](https://coveralls.io/repos/utilise/key/badge.svg?branch=master)](https://coveralls.io/r/utilise/key?branch=master) [![Build](https://api.travis-ci.org/utilise/key.svg)](https://travis-ci.org/utilise/key) key

Powerful versatile operator for accessing/setting key(s)

```js
key('name')(d)                        // returns value of property name from object d
key('details.profile.name')(d)        // returns deep property
key('details', 'foo')(d)              // set property
key('details.profile.name', 'foo')(d) // set deep property
key(['name', 'city.name'])(d)         // returns object with selected keys (can mix from any level)
key()(d)                              // returns object root if key undefined
```

Accessing deep keys returns `undefined` if a link is missing, which prevents doing things like: 

```js
(((d || {}).details || {}).profile || {}).name
```

Setting a deep key will create any missing keys it needs as it traverses the path.

If the second value parameter is a function, it evaluates it with the data before setting. 

To make dates in all records human-readable with moment for example:

```js
orders = [ { .. }, { .. } ]
orders
  .map(key('date', mo.format('MMM Do YY')))
```

## [![Coverage Status](https://coveralls.io/repos/utilise/keys/badge.svg?branch=master)](https://coveralls.io/r/utilise/keys?branch=master) [![Build](https://api.travis-ci.org/utilise/keys.svg)](https://travis-ci.org/utilise/keys) keys

Alias for `Object.keys`

```js
keys({ foo: 1, bar: 2}) // returns ['foo', 'bar']
```

## [![Coverage Status](https://coveralls.io/repos/utilise/last/badge.svg?branch=master)](https://coveralls.io/r/utilise/last?branch=master) [![Build](https://api.travis-ci.org/utilise/last.svg)](https://travis-ci.org/utilise/last) last

Returns the last element in the array

```js
last(array) // returns array[array.length-1]
```

## [![Coverage Status](https://coveralls.io/repos/utilise/link/badge.svg?branch=master)](https://coveralls.io/r/utilise/link?branch=master) [![Build](https://api.travis-ci.org/utilise/link.svg)](https://travis-ci.org/utilise/link) link

Links changes in the attribute of one component to the attribute of another

```js
// when a different day is selected in the calendar, the detail page automatically updates
link('events-calendar[selected-day]', 'event-detail[day]')
```

```html
<events-calendar selected-day="1-1-1970" />
<event-detail day="1-1-1970"/>
```

## [![Coverage Status](https://coveralls.io/repos/utilise/lo/badge.svg?branch=master)](https://coveralls.io/r/utilise/lo?branch=master) [![Build](https://api.travis-ci.org/utilise/lo.svg)](https://travis-ci.org/utilise/lo) lo

Lowercase a string

```js
['A', 'B', 'C'].map(lo) // returns ['a', 'b', 'c']
```

## [![Coverage Status](https://coveralls.io/repos/utilise/log/badge.svg?branch=master)](https://coveralls.io/r/utilise/log?branch=master) [![Build](https://api.travis-ci.org/utilise/log.svg)](https://travis-ci.org/utilise/log) log

Lightweight scoped version of `console.log` with a prefix, useful for per module identification

```js
log = log('[module/prefix]')
log('something went wrong!') // [module/prefix] something went wrong
```

Returns the input, so it is useful with intermediary logging whilst iterating over a list

```js
list
  .map(op1)
  .map(log)
  .map(op2)
```

## [![Coverage Status](https://coveralls.io/repos/utilise/mo/badge.svg?branch=master)](https://coveralls.io/r/utilise/mo?branch=master) [![Build](https://api.travis-ci.org/utilise/mo.svg)](https://travis-ci.org/utilise/mo) mo

Convenience functions working with moment

```js
dates.map(mo)                     // convert to moment object
dates.map(mo.format('Do MMM YY')) // convert to specific format
dates.map(mo.iso)                 // convert to iso date format
```

## [![Coverage Status](https://coveralls.io/repos/utilise/noop/badge.svg?branch=master)](https://coveralls.io/r/utilise/noop?branch=master) [![Build](https://api.travis-ci.org/utilise/noop.svg)](https://travis-ci.org/utilise/noop) noop

Function that does nothing

```js
;(fn || noop)()
```

## [![Coverage Status](https://coveralls.io/repos/utilise/not/badge.svg?branch=master)](https://coveralls.io/r/utilise/not?branch=master) [![Build](https://api.travis-ci.org/utilise/not.svg)](https://travis-ci.org/utilise/not) not

Negates the result of a function

```js
numbers
  .filter(not(isEven))
  .filter(not(is('5')))
```

## [![Coverage Status](https://coveralls.io/repos/utilise/objectify/badge.svg?branch=master)](https://coveralls.io/r/utilise/objectify?branch=master) [![Build](https://api.travis-ci.org/utilise/objectify.svg)](https://travis-ci.org/utilise/objectify) objectify

Converts an array to an object. Uses `name` property as key by default if none specified

```js
objectify([
  { name: 'foo', value: 1 }
, { name: 'bar', value: 2 }
], 'name')

/* returns 
{ 
  foo: { name: 'foo', value: 1 }
, bar: { name: 'bar', value: 2 }
} 
*/
```

## [![Coverage Status](https://coveralls.io/repos/utilise/once/badge.svg?branch=master)](https://coveralls.io/r/utilise/once?branch=master) [![Build](https://api.travis-ci.org/utilise/once.svg)](https://travis-ci.org/utilise/once) once

Function for building entirely data-driven idempotent components/UI with D3.

```js
once(node)                        // limit to this node
  ('div', { results: [1, 2, 3] }) // creates one div (with the specified datum)
    ('li', key('results'))        // creates three li (with datum 1, 2, 3 respectively)
      ('a', inherit)              // creates anchor in each li (with parent datum)
        .text(String)             // sets the text in anchor to the datum
```

The first time you call `once(node | string)` it essentially selects that element and limits the scope of subsequent operations to that.

Subsequents calls generate a D3 join using the syntax `(selector, data)`. The selector can be:
* A selector string (`foo.bar.baz`). Classes are fine too and will be added to the final elements created.
* A real element, which will be replicated. 
* A function, which will be given parent data, in case you wish to output different (custom) elements based on data.

The data is the same as what you would normally use to generate a join (array of items, or function), with some convenient defaults: if you pass an object, number or boolean it'll be converted to a single-valued array, meaning "create one element with this as the datum". If you pass in a falsy, it defaults to empty array "meaning removing all elements of this type".

The return value is essentially a D3 join selection (enter/update/exit), so you can continue to customise using `.text`, `.classed`, `.attr`, etc. You can also access the elements added via `.enter` and removed via `.exit`.

There are two further optional arguments you can use `(selector, data[, key[, before]])`. The key function has the exact same meaning as normal (how to key data), which D3 defaults to by index. The before parameter can be used to force the insertion before a specific element à la `.insert(something, before)` as opposed to just `.append(something)`.

## [![Coverage Status](https://coveralls.io/repos/utilise/owner/badge.svg?branch=master)](https://coveralls.io/r/utilise/owner?branch=master) [![Build](https://api.travis-ci.org/utilise/owner.svg)](https://travis-ci.org/utilise/owner) owner

Either window or global dependeing on executing context

```js
// browser
owner == window

// server
owner == global
```

## [![Coverage Status](https://coveralls.io/repos/utilise/parse/badge.svg?branch=master)](https://coveralls.io/r/utilise/parse?branch=master) [![Build](https://api.travis-ci.org/utilise/parse.svg)](https://travis-ci.org/utilise/parse) parse

Equivalent to `JSON.parse`

## [![Coverage Status](https://coveralls.io/repos/utilise/pause/badge.svg?branch=master)](https://coveralls.io/r/utilise/pause?branch=master) [![Build](https://api.travis-ci.org/utilise/pause.svg)](https://travis-ci.org/utilise/parse) pause

Actually pauses a stream so you can build up a pipeline, pass it around, attach more pipes, before starting the flow. Server only.

```js
var stream = pause(browserify)
  .pipe(via(minify))
  .pipe(via(deadcode))

addMorePipes(stream)

function addMorePipes(stream){
  stream
    .on('end', doSomething)
    .pipe(file)
    .flow()
}
```

## [![Coverage Status](https://coveralls.io/repos/utilise/perf/badge.svg?branch=master)](https://coveralls.io/r/utilise/perf?branch=master) [![Build](https://api.travis-ci.org/utilise/perf.svg)](https://travis-ci.org/utilise/perf) perf

Evaluate how long a function takes in milliseconds. 

```js
perf(function(){ .. })  // Evaluates the function, logs the time taken, and returns time in ms
```

## [![Coverage Status](https://coveralls.io/repos/utilise/prepend/badge.svg?branch=master)](https://coveralls.io/r/utilise/prepend?branch=master) [![Build](https://api.travis-ci.org/utilise/prepend.svg)](https://travis-ci.org/utilise/prepend) prepend

Prepend something to a string

```js
['foo', 'bar']
  .map(prepend('hi-'))  // returns ['hi-foo', 'hi-bar']
```

## [![Coverage Status](https://coveralls.io/repos/utilise/promise/badge.svg?branch=master)](https://coveralls.io/r/utilise/promise?branch=master) [![Build](https://api.travis-ci.org/utilise/promise.svg)](https://travis-ci.org/utilise/promise) promise

Convenience functions for working with (native) Promises

```js
var p = promise()                 // creates promise with resolve/reject attached
p.resolve('result')
p.reject('something went wrong')

promise(5)                        // creates promise and resolves to value
promise.args(1)('foo', 'bar')     // creates promise that resolves to argument given
promise.sync(1)('foo', 'bar')     // creates thenable that immediately invokes then callback
promise.noop()                    // creates empty promise
promise.null()                    // creates promise that resolves to null
```

## [![Coverage Status](https://coveralls.io/repos/utilise/proxy/badge.svg?branch=master)](https://coveralls.io/r/utilise/proxy?branch=master) [![Build](https://api.travis-ci.org/utilise/proxy.svg)](https://travis-ci.org/utilise/proxy) proxy

Proxy a function. It is common to use `fn.apply(this, arguments)` for proxying. This function allows you to do that, but alter the return value and/or context.

```js
proxy(fn, 5)      // returns a function that invokes fn, but then always returns 5
proxy(fn, 5, {})  // same as above, but also changes context variable
```

## [![Coverage Status](https://coveralls.io/repos/utilise/raw/badge.svg?branch=master)](https://coveralls.io/r/utilise/raw?branch=master) [![Build](https://api.travis-ci.org/utilise/raw.svg)](https://travis-ci.org/utilise/raw) raw

Select an element based on a CSS selector, piercing shadow boundaries if the browser supports it.

```js
raw('.foo')
```

## [![Coverage Status](https://coveralls.io/repos/utilise/rebind/badge.svg?branch=master)](https://coveralls.io/r/utilise/rebind?branch=master) [![Build](https://api.travis-ci.org/utilise/rebind.svg)](https://travis-ci.org/utilise/rebind) rebind

D3 rebind function to rebind accessors. See the [docs here](https://github.com/mbostock/d3/wiki/Internals#rebind).

## [![Coverage Status](https://coveralls.io/repos/utilise/replace/badge.svg?branch=master)](https://coveralls.io/r/utilise/replace?branch=master) [![Build](https://api.travis-ci.org/utilise/replace.svg)](https://travis-ci.org/utilise/replace) replace

Replace a value in a string

```js
['Hi name', 'Bye name']
  .map(replace('name', 'foo'))
```

## [![Coverage Status](https://coveralls.io/repos/utilise/resourcify/badge.svg?branch=master)](https://coveralls.io/r/utilise/resourcify?branch=master) [![Build](https://api.travis-ci.org/utilise/resourcify.svg)](https://travis-ci.org/utilise/resourcify) resourcify

Returns the specified resource from a ripple instance. Returns an object of resources if multiple specified. Returns `undefined` if one of the resources not present.

```js
resourcify(ripple)('foo')         // returns body of foo
resourcify(ripple)('foo bar')     // returns { foo: foo-body, bar: bar-body }
resourcify(ripple)('foo bar baz') // returns undefined, since no baz resource
```

## [![Coverage Status](https://coveralls.io/repos/utilise/sall/badge.svg?branch=master)](https://coveralls.io/r/utilise/sall?branch=master) [![Build](https://api.travis-ci.org/utilise/sall.svg)](https://travis-ci.org/utilise/sall) sall

Convenience function for `d3.selectAll`. Returns 

```js
sall(parent)(selector)
```

Parent can be selection/string/node. If no parent, selects globally.

## [![Coverage Status](https://coveralls.io/repos/utilise/sel/badge.svg?branch=master)](https://coveralls.io/r/utilise/sel?branch=master) [![Build](https://api.travis-ci.org/utilise/sel.svg)](https://travis-ci.org/utilise/sel) sel

Convenience function for `d3.select`.

```js
sel(string)
```

## [![Coverage Status](https://coveralls.io/repos/utilise/send/badge.svg?branch=master)](https://coveralls.io/r/utilise/send?branch=master) [![Build](https://api.travis-ci.org/utilise/send.svg)](https://travis-ci.org/utilise/send) send

Sends a file on an express route. Server only.

```js
app.get('/file', send('./file'))
```

## [![Coverage Status](https://coveralls.io/repos/utilise/str/badge.svg?branch=master)](https://coveralls.io/r/utilise/str?branch=master) [![Build](https://api.travis-ci.org/utilise/str.svg)](https://travis-ci.org/utilise/str) str

Coerces anything into a string

```js
str(5)                // returns '5'
str({ foo: 5 })       // returns '{ foo: 5 }'
str(undefined)        // returns ''
str(function(){ .. }) // returns 'function(){ .. }'
```

## [![Coverage Status](https://coveralls.io/repos/utilise/to/badge.svg?branch=master)](https://coveralls.io/r/utilise/to?branch=master) [![Build](https://api.travis-ci.org/utilise/to.svg)](https://travis-ci.org/utilise/to) to

Converts to a primitive type (only real arrays)

```js
to.arr(NodeList)
to.arr(arguments)
```

## [![Coverage Status](https://coveralls.io/repos/utilise/values/badge.svg?branch=master)](https://coveralls.io/r/utilise/values?branch=master) [![Build](https://api.travis-ci.org/utilise/values.svg)](https://travis-ci.org/utilise/values) values

Converts an object to array

```js
values({ 
  a: { name: 'foo', value: 1 }
, b: { name: 'bar', value: 2 }
})

/* returns
[ 
  { name: 'foo', value: 1 }
, { name: 'bar', value: 2 }
]
*/

```

## [![Coverage Status](https://coveralls.io/repos/utilise/via/badge.svg?branch=master)](https://coveralls.io/r/utilise/via?branch=master) [![Build](https://api.travis-ci.org/utilise/via.svg)](https://travis-ci.org/utilise/via) via

Buffers output to a stream destination. Useful when you need the whole input rather than chunks. Server only.

```js
stream
  .pipe(via(minify))
  .pipe(via(replace))
```

## [![Coverage Status](https://coveralls.io/repos/utilise/wrap/badge.svg?branch=master)](https://coveralls.io/r/utilise/wrap?branch=master) [![Build](https://api.travis-ci.org/utilise/wrap.svg)](https://travis-ci.org/utilise/wrap) wrap

Wraps something in a function which returns it when executed

```js
wrapped = wrap(5)
wrapped()          // returns 5
```