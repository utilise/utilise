var attr = require('utilise/attr')
  , raw = require('utilise/raw')
  
module.exports = link

function link(from, to){
  var key = from + '|' + to
    , from = destructure(from)
    , to = destructure(to)
    
  if (!from.el || !to.el) return;
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