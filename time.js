module.exports = function time(ms, fn) {
  return setTimeout(fn, ms)
}