'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

class DetailsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const entity = this.props.entity;
    const component = this.props.component;

    return (
      <h2>{component.id}</h2>
    );
  }
}

DetailsComponent.propTypes = {
  entity: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
};

export default DetailsComponent;