const visit = require('unist-util-visit');

module.exports = function() {
  return function(tree, file) {
    visit(tree,function(node) {
      if (node.tagName === 'a') {
        const match = /^\[(.*)\]/.exec(node.properties.href);
        if (match) {
          node.properties.href = match[1]
        }
      }
    })
  }
}
