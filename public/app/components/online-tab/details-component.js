'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

import DetailsTitle from './details-title';
import DetailsContainer from './details-container';

class DetailsComponent extends React.Component {

  constructor(props, context) {
    super(props);
    this.state = {
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
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
        <DetailsContainer>
        </DetailsContainer>
      </div>
    );
  }
}

DetailsComponent.propTypes = {
  entity: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object
};

DetailsComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};

DetailsComponent.contextTypes = {
  muiTheme: React.PropTypes.object
};

export default DetailsComponent;