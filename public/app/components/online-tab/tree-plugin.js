'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';

class TreePlugin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const plugin = this.props.plugin;
    return (<mui.ListItem><div>{`${plugin.library}.${plugin.type}`}</div></mui.ListItem>);
  }
}

TreePlugin.propTypes = {
  plugin: React.PropTypes.object.isRequired
};

export default TreePlugin;