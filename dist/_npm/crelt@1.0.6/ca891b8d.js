/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/crelt@1.0.6/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function e(){var e=arguments[0];"string"==typeof e&&(e=document.createElement(e));var t=1,n=arguments[1];if(n&&"object"==typeof n&&null==n.nodeType&&!Array.isArray(n)){for(var o in n)if(Object.prototype.hasOwnProperty.call(n,o)){var l=n[o];"string"==typeof l?e.setAttribute(o,l):null!=l&&(e[o]=l)}t++}for(;t<arguments.length;t++)r(e,arguments[t]);return e}function r(e,t){if("string"==typeof t)e.appendChild(document.createTextNode(t));else if(null==t);else if(null!=t.nodeType)e.appendChild(t);else{if(!Array.isArray(t))throw new RangeError("Unsupported child node: "+t);for(var n=0;n<t.length;n++)r(e,t[n])}}export{e as default};
