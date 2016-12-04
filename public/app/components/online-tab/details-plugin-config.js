'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';

import Facade from '../../services/facade';

const DetailsPluginConfig = ({ config }) => (
  <div>
    <base.icons.NetConfig style={{verticalAlign: 'middle'}}/>
    &nbsp;
    Configuration:
    &nbsp;
    {config.name}
    &nbsp;
    {Facade.metadata.getConfigTypeName(config.type)}
    <mui.Divider />
  </div>
);

DetailsPluginConfig.propTypes = {
  config: React.PropTypes.object.isRequired,
};

export default DetailsPluginConfig;