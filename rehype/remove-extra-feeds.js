const remove = require('unist-util-remove');

module.exports = function attacher() {
  
  return function transformer(tree, file) {
    remove(tree,{}, function (node) {
      return node.tagName === 'link' && /rss/.test(node.properties.type || "") && node.properties.href !== '/feed'
    })
  }
}
