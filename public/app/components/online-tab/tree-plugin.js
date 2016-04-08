'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';
import base from '../base/index';

class TreePlugin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const entity = this.props.entity;
    const plugin = this.props.plugin;
    const value = { type: 'plugin', entity: entity.id, plugin: `${plugin.library}.${plugin.type}` };

    return (
      <base.SelectableListItem value={value}>
        <div>
          {`${plugin.library}.${plugin.type}`}
        </div>
      </base.SelectableListItem>
    );
  }
}

TreePlugin.propTypes = {
  entity: React.PropTypes.object.isRequired,
  plugin: React.PropTypes.object.isRequired
};

export default TreePlugin;