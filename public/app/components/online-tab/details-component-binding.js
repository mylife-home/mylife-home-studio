'use strict';

import React from 'react';
import base from '../base/index';

import DetailsContainer from './details-container';

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