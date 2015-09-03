module.exports = function unique(matched, value, i){
  if (i === 0) matched = [matched]
  if (!~matched.indexOf(value)) matched.push(value)
  return matched
}
