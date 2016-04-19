'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

import DetailsTitle from './details-title';

class DetailsComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const entity = this.props.entity;
    const component = this.props.component;

    return (
      <div>
        <DetailsTitle
          center={
            <div>
              {component.id}
            </div>
          }
          left={
            <div>
              <base.icons.Component />
              &nbsp;
              Component
            </div>
          }
          right={
            <div>
              <base.icons.Plugin />
              &nbsp;
              {`${component.library}.${component.type}`}
            </div>
          }/>
      </div>
    );
  }
}

DetailsComponent.propTypes = {
  entity: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
};

export default DetailsComponent;