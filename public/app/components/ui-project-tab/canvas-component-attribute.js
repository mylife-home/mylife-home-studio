'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';

const CanvasComponentAttribute = ({ attribute }) => (
  <div>
    <base.icons.NetAttribute style={{verticalAlign: 'middle'}}/>
    &nbsp;
    Attribute:
    &nbsp;
    {attribute.name}
    &nbsp;
    {attribute.type.toString()}
    <mui.Divider />
  </div>
);

CanvasComponentAttribute.propTypes = {
  attribute: React.PropTypes.object.isRequired,
};

export default CanvasComponentAttribute;