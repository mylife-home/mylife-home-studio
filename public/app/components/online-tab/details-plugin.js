'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';
import Facade from '../../services/facade';

import DetailsTitle from './details-title';
import DetailsContainer from './details-container';

class DetailsPlugin extends React.Component {

  constructor(props, context) {
    super(props);
    this.state = {};
  }

  renderUsageIcon(plugin) {
    switch(plugin.usage) {
    case Facade.metadata.pluginUsage.driver:
      return (
        <div>
          <base.icons.PluginDriver />
          &nbsp;
          Hardware driver
        </div>
      );

    case Facade.metadata.pluginUsage.vpanel:
      return (
        <div>
          <base.icons.PluginVPanel />
          &nbsp;
          Virtual panel
        </div>
      );

    case Facade.metadata.pluginUsage.ui:
      return (
        <div>
          <base.icons.PluginUi />
          &nbsp;
          UI
        </div>
      );

    default:
      return null;
    }
  }

  render() {
    const entity = this.props.entity;
    const plugin = this.props.plugin;

    return (
      <div>
        <DetailsTitle
          center={
            <div>
              {`${plugin.library}.${plugin.type}`}
            </div>
          }
          left={
            <div>
              <base.icons.Plugin />
              &nbsp;
              Plugin
            </div>
          }
          right={this.renderUsageIcon(plugin)}/>
        <DetailsContainer>
          <base.icons.actions.Info style={{verticalAlign: 'middle'}}/>
           &nbsp;
           Version: {plugin.version}
           <mui.Divider />
        </DetailsContainer>
      </div>
    );
  }
}

DetailsPlugin.propTypes = {
  entity: React.PropTypes.object.isRequired,
  plugin: React.PropTypes.object.isRequired,
};

export default DetailsPlugin;