// This file contains inlined assets that are bundled at build time
// The ?raw suffix tells the bundler to import these as strings

import stylesCSS from './styles.css?raw';
import lineCSS from './loaders/line.css?raw';
import lineHTML from './loaders/line.html?raw';
import dotsCSS from './loaders/dots.css?raw';
import dotsHTML from './loaders/dots.html?raw';

export const assets = {
  stylesCSS,
  lineCSS,
  lineHTML,
  dotsCSS,
  dotsHTML,
};
