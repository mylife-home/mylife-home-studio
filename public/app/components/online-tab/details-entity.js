'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

class DetailsEntity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const entity = this.props.entity;

    return (
      <h2>{entity.id}</h2>
    );
  }
}

DetailsEntity.propTypes = {
  entity: React.PropTypes.object.isRequired,
};

export default DetailsEntity;