const remove = require('unist-util-remove');

module.exports = function attacher() {
  
  return function transformer(tree, file) {
  
    remove(tree,{},function(node) {
      if (node.tagName === 'script') {
        if (node.properties.src) {
          return /wp-includes/.test(node.properties.src) || /contact-form-7/.test(node.properties.src)
        } else {
          console.error(node)
          return /wpemoji/.test(node.children[0].value) || /wpcf7/.test(node.children[0].value);
        }
      }
      return false;
    })
  }
}
