'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';
import MainTitle from '../main-title';

import Facade from '../../services/facade';

import DetailsContainer from './details-container';
import DetailsPluginAction from './details-plugin-action';
import DetailsPluginAttribute from './details-plugin-attribute';
import DetailsPluginConfig from './details-plugin-config';

function renderUsageIcon(plugin) {
  switch(plugin.usage) {
    case Facade.metadata.pluginUsage.driver:
      return (
        <div>
          <icons.PluginDriver />
          &nbsp;
          Hardware driver
        </div>
      );

    case Facade.metadata.pluginUsage.vpanel:
      return (
        <div>
          <icons.PluginVPanel />
          &nbsp;
          Virtual panel
        </div>
      );

    case Facade.metadata.pluginUsage.ui:
      return (
        <div>
          <icons.PluginUi />
          &nbsp;
          UI
        </div>
      );

    default:
      return null;
  }
}

const DetailsPlugin = ({ plugin }) => {
  const clazz  = Facade.metadata.parseClass(plugin.clazz);
  const config = Facade.metadata.parseConfig(plugin.config);

  return (
    <div>
      <MainTitle
        center={
          <div>
            {`${plugin.library}.${plugin.type}`}
          </div>
        }
        left={
          <div>
            <icons.Plugin />
            &nbsp;
            Plugin
          </div>
        }
        right={renderUsageIcon(plugin)}/>
      <DetailsContainer>
        <icons.actions.Info style={{verticalAlign: 'middle'}}/>
        &nbsp;
        Version:
        &nbsp;
        {plugin.version}
        <mui.Divider />
        {clazz.actions.map(action => (<DetailsPluginAction action={action} key={action.name}/>))}
        {clazz.attributes.map(attribute => (<DetailsPluginAttribute attribute={attribute} key={attribute.name}/>))}
        {config.map(conf => (<DetailsPluginConfig config={conf} key={conf.name}/>))}
      </DetailsContainer>
    </div>
  );
};

DetailsPlugin.propTypes = {
  plugin: React.PropTypes.object.isRequired,
};

export default DetailsPlugin;