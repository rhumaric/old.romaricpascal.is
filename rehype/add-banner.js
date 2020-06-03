const {select} = require('hast-util-select');
const classList = require('hast-util-class-list');
const rehype = require('rehype');
const h = require('hastscript');

const BANNER_CLASSNAME = 'rp-Banner'
const BANNER_HTML = `
          <p class="${BANNER_CLASSNAME}">
            You're currently viewing an old version of this website,
            kept to not destroy content. 
            <br>
            If you're after the latest content,
            please head to <a href="https://romaricpascal.is">the newest version</a>.
          </p>
        `

module.exports = function() {
  return function(tree) {
    // Grab the header
    const firstChild = select('.rp-Header', tree);
    if (firstChild) {
      const existingBanner = select(`.${BANNER_CLASSNAME}`,tree);
      if(!existingBanner) {
        
        // First let's wrap the content of the existing header in a wrapper
        const existingHeaderWrapper = h('div',{className: 'rp-HeaderContent'}, firstChild.children);

        // Then create the banner
        const c = rehype().parse(BANNER_HTML);
        const banner = select('body > *', c);
        
        // And finally replace the content of the header with it
        firstChild.children = [banner, existingHeaderWrapper];
      }
    }
  }
}
