module.exports = function unique(matched, value, i){
  if (i === 1) matched = [matched]
  if (!~matched.indexOf(value)) matched.push(value)
  return matched
}
