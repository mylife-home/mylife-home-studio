'use strict';

import React from 'react';
import * as mui from 'material-ui';

import ToolboxControl from './toolbox-control';

const Toolbox = ({ project }) => (
  <mui.List>
    <mui.ListItem key={'text'}>
      <ToolboxControl project={project} type={'text'}></ToolboxControl>
    </mui.ListItem>
    <mui.ListItem key={'image'}>
      <ToolboxControl project={project} type={'image'}></ToolboxControl>
    </mui.ListItem>
  </mui.List>
);

Toolbox.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Toolbox;
