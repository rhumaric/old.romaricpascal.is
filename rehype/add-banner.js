const {select} = require('hast-util-select');
const classList = require('hast-util-class-list');
const rehype = require('rehype');
const h = require('hastscript');

const BANNER_CLASSNAME = 'rp-Banner'
const BANNER_HTML = `
          <p class="${BANNER_CLASSNAME}">
            I'm no longer doing lettering professionally, to re-focus on web development. 
            A <a href="https://romaricpascal.is">newer version of this site</a> is being built to reflect this.
            <br>
            This version is kept as an archive to ensure its <a href="https://4042302.org/">content don't disappear as I update my site</a>
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
      } else {
        // Then create the banner
        const c = rehype().parse(BANNER_HTML);
        const banner = select('body > *', c);

        const [existingBanner,...otherChildren] = firstChild.children;
        firstChild.children = [banner, ...otherChildren];
      }
    }
  }
}
