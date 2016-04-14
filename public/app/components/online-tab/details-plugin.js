'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

class DetailsPlugin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const entity = this.props.entity;
    const plugin = this.props.plugin;

    return (
      <h2>{`${plugin.library}.${plugin.type}`}</h2>
    );
  }
}

DetailsPlugin.propTypes = {
  entity: React.PropTypes.object.isRequired,
  plugin: React.PropTypes.object.isRequired,
};

export default DetailsPlugin;