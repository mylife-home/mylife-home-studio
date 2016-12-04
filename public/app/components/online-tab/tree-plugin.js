'use strict';

import React from 'react';
import base from '../base/index';

import Facade from '../../services/facade';

function renderUsageIcon(plugin) {
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

const TreePlugin = ({ entity, plugin }) => {
  const value = { type: 'plugin', entity: entity.id, plugin: `${plugin.library}.${plugin.type}` };

  return (
    <base.SelectableListItem
      value={value}
      leftIcon={
        <base.TooltipContainer tooltip="Plugin">
          <base.icons.Plugin />
        </base.TooltipContainer>
      }
      rightIcon={renderUsageIcon(plugin)}
      primaryText={`${plugin.library}.${plugin.type}`}
    />
  );
};

TreePlugin.propTypes = {
  entity: React.PropTypes.object.isRequired,
  plugin: React.PropTypes.object.isRequired
};

export default TreePlugin;