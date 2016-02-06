module.exports = function draw(host, fn, state) {
  host.state = state
  host.draw = function(d){ return fn && fn.call(host, host.state) }
  host.draw()
  return host
}