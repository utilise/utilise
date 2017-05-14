module.exports = function delay(ms, d){ 
  return new Promise(function(resolve){
    setTimeout(function(){ resolve(d) }, ms)
  })
}