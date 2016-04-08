'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';


class TreeEntity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <mui.ListItem>{this.props.entity.id}</mui.ListItem>
    );
  }
}

TreeEntity.propTypes = {
  entity: React.PropTypes.object.isRequired
};

export default TreeEntity;