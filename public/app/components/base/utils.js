'use strict';

function download(content, mime, filename) {
  const pom = document.createElement('a');
  pom.setAttribute('href', `data:${mime};charset=utf-8, ${encodeURIComponent(content)}`);
  pom.setAttribute('download', filename);
  pom.click();
  document.removeChild(pom);
}

export default {
  download
};