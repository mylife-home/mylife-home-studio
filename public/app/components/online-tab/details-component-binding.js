'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';

const DetailsComponentBinding = ({ binding }) => (
  <div>
    <base.icons.Binding style={{verticalAlign: 'middle'}}/>
    &nbsp;
    Binding:
    &nbsp;
    {`${binding.remote_id}.${binding.remote_attribute}`}
    &nbsp;
    ->
    &nbsp;
    {binding.local_action}
    <mui.Divider />
  </div>
);

DetailsComponentBinding.propTypes = {
  binding: React.PropTypes.object.isRequired
};

export default DetailsComponentBinding;