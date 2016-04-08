'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';

class TreeResource extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const resource = this.props.resource;
    return (<mui.ListItem><div>{resource}</div></mui.ListItem>);
  }
}

TreeResource.propTypes = {
  resource: React.PropTypes.string.isRequired
};

export default TreeResource;