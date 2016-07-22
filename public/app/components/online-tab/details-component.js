'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

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

  renderConfig(conf) {
    return (
      <div key={conf.key}>
        <base.icons.NetConfig style={{verticalAlign: 'middle'}}/>
        &nbsp;
        Configuration:
        &nbsp;
        {conf.key}
        &nbsp;
        =
        &nbsp;
        {conf.value}
        <mui.Divider />
      </div>
    );
  }

  renderBinding(binding) {
    const key = `${binding.remote_id}:${binding.remote_attribute}:${binding.local_action}`;
    return (
      <div key={key}>
        <base.icons.Binding style={{verticalAlign: 'middle'}}/>
        &nbsp;
        Binding:
        &nbsp;
        {`${binding.remote_id}.${binding.remote_attribute}`}
        &nbsp;
        ->
        &nbsp;
        {binding.local_action}
        <mui.Divider />
      </div>
    );
  }

  render() {
    const entity = this.props.entity;
    const component = this.props.component;

    return (
      <div>
        <base.DetailsTitle
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
          {component.config.map(this.renderConfig, this)}
          {component.bindings.map(this.renderBinding, this)}
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