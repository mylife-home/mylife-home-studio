'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';

const DetailsPluginAttribute = ({ attribute }) => (
  <div>
    <icons.NetAttribute style={{verticalAlign: 'middle'}}/>
    &nbsp;
    Attribute:
    &nbsp;
    {attribute.name}
    &nbsp;
    {attribute.type.toString()}
    <mui.Divider />
  </div>
);


DetailsPluginAttribute.propTypes = {
  attribute: React.PropTypes.object.isRequired,
};

export default DetailsPluginAttribute;