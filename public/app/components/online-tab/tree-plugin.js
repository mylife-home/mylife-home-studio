'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';

import Facade from '../../services/facade';

class TreePlugin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderUsageIcon(plugin) {
    switch(plugin.usage) {
    case Facade.metadata.pluginUsage.driver:
      return (
        <base.TooltipContainer tooltip="Hardware driver">
          <base.icons.PluginDriver />
        </base.TooltipContainer>
      );

    case Facade.metadata.pluginUsage.vpanel:
      return (
        <base.TooltipContainer tooltip="Virtual panel">
          <base.icons.PluginVPanel />
        </base.TooltipContainer>
      );

    case Facade.metadata.pluginUsage.ui:
      return (
        <base.TooltipContainer tooltip="UI">
          <base.icons.PluginUi />
        </base.TooltipContainer>
      );

    default:
      return null;
    }
  }

  render() {
    const entity = this.props.entity;
    const plugin = this.props.plugin;
    const value = { type: 'plugin', entity: entity.id, plugin: `${plugin.library}.${plugin.type}` };

    return (
      <base.SelectableListItem
        value={value}
        leftIcon={
          <base.TooltipContainer tooltip="Plugin">
            <base.icons.Plugin />
          </base.TooltipContainer>
        }
        rightIcon={this.renderUsageIcon(plugin)}
        primaryText={`${plugin.library}.${plugin.type}`}
      />
    );
  }
}

TreePlugin.propTypes = {
  entity: React.PropTypes.object.isRequired,
  plugin: React.PropTypes.object.isRequired
};

export default TreePlugin;