'use strict';

import Repository from './repository';
import Resources from './resources';
import Metadata from './metadata/index';

export default {
  repository : new Repository(),
  resources  : new Resources(),
  metadata   : new Metadata()
}