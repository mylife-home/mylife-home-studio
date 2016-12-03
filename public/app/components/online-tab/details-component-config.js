'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';

const DetailsComponentConfig = ({ config }) => (
  <div>
    <base.icons.NetConfig style={{verticalAlign: 'middle'}}/>
    &nbsp;
    Configuration:
    &nbsp;
    {config.key}
    &nbsp;
    =
    &nbsp;
    {config.value}
    <mui.Divider />
  </div>
);

DetailsComponentConfig.propTypes = {
  config: React.PropTypes.object.isRequired,
};

export default DetailsComponentConfig;
