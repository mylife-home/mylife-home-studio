'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';

class TreeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const component = this.props.component;
    return (<mui.ListItem><div>{component.id}</div></mui.ListItem>);
  }
}

TreeComponent.propTypes = {
  component: React.PropTypes.object.isRequired
};

export default TreeComponent;