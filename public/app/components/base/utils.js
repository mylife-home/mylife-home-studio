'use strict';

import arraySort from 'array-sort';

const GRID_SIZE = 32;

function download(content, mime, filename) {
  const pom = document.createElement('a');
  pom.setAttribute('href', `data:${mime};charset=utf-8, ${encodeURIComponent(content)}`);
  pom.setAttribute('download', filename);
  pom.click();
}

function imageSize(content, cb) {
  const img = document.createElement("img");
  img.src = `data:;base64,${content}`;
  img.onload = () => cb(null, {
      height: img.height,
      width: img.width
    });
}

// https://gist.github.com/jlong/2428561
function parseUrl(url) {
  const parser = document.createElement('a');
  parser.href = url;

  return {
    protocol: parser.protocol,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    hash: parser.hash,
    host: parser.host
  };
}

function stopPropagationWrapper(func) {
  const self = this;
  return function(e) {
    if(e) { e.stopPropagation(); }
    func.apply(self, arguments);
  }
}

function snapToGrid(location, inPlace) {
  const ret = inPlace ? location : { x: location.x, y : location.y };
  ret.x = Math.round(ret.x / GRID_SIZE) * GRID_SIZE;
  ret.y = Math.round(ret.y / GRID_SIZE) * GRID_SIZE;
  return ret;
}

function sortBy(array, key) {
  const ret = array.slice();
  if(key === undefined) {
    ret.sort();
  } else {
    arraySort(ret, key);
  }
  return ret;
}

export default {
  download,
  imageSize,
  parseUrl,
  stopPropagationWrapper,
  snapToGrid,
  sortBy,
  GRID_SIZE
};