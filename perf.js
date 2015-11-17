var log = require('utilise/log')('[perf]')
  , client = require('utilise/client')

module.exports =  function perf(fn, msg) {
  return function(){ console.log('args', arguments)
    /* istanbul ignore next */
    var start  = client ? performance.now() : process.hrtime()
      , retval = fn.apply(this, arguments)
      , diff   = client ? performance.now() - start : process.hrtime(start)

    !client && (diff = (diff[0]*1e3 + diff[1]/1e6))
    log(msg || fn.name, diff, 'ms'), diff
    return retval
  }
}