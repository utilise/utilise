var debounce = require('utilise/debounce')
  , through = require('through')
  , noop = require('utilise/noop')

module.exports = function via(fn){
  var stream = through(write, noop)
    , once = debounce(push)
    , buffer = ''

  return stream

  function write(chunk){
    buffer += chunk
    once()
  }

  function push(){ 
    stream.push(fn(buffer.toString())) 
  }
}