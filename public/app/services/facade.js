'use strict';

import Repository from './repository';
import Resources  from './resources';
import Services  from './services';
import Metadata   from './metadata/index';
import Projects   from './projects/index';

export default {
  repository : new Repository(),
  resources  : new Resources(),
  services   : new Services(),
  metadata   : new Metadata(),
  projects   : new Projects()
};