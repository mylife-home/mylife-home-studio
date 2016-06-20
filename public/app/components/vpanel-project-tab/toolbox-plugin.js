'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import Toolbar from './toolbar';

class ToolboxPlugin extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const plugin = this.props.plugin;

    return (
      <div>{plugin.library + ':' + plugin.type}</div>
    );
  }
}

ToolboxPlugin.propTypes = {
  plugin: React.PropTypes.object.isRequired,
};

export default ToolboxPlugin;

