const remove = require('unist-util-remove');

module.exports = function attacher() {
  
  return function transformer(tree, file) {
  
    remove(tree,{},function(node) {
      if (node.tagName === 'script') {
        if (node.properties.src) {
          return /wp-includes/.test(node.properties.src) || /wp-content\/plugins/.test(node.properties.src)
        } else {
          return /wpemoji/.test(node.children[0].value) || /wpcf7/.test(node.children[0].value);
        }
      }
      if (node.tagName === 'link') {
        return /wp-content\/plugins/.test(node.properties.href);
      }
      return false;
    })
  }
}
