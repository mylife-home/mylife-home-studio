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

  renderAction(act) {
    return (
      <div key={act.name}>
        <base.icons.NetAction style={{verticalAlign: 'middle'}}/>
        &nbsp;
        Action:
        &nbsp;
        {act.name}
        &nbsp;
        {act.types.map(t => t.toString()).join(', ')}
        <mui.Divider />
      </div>
    );
  }

  renderAttribute(attr) {
    return (
      <div key={attr.name}>
        <base.icons.NetAttribute style={{verticalAlign: 'middle'}}/>
        &nbsp;
        Attribute:
        &nbsp;
        {attr.name}
        &nbsp;
        {attr.type.toString()}
        <mui.Divider />
      </div>
    );
  }

  renderConfig(conf) {
    return (
      <div key={conf.name}>
        <base.icons.NetConfig style={{verticalAlign: 'middle'}}/>
        &nbsp;
        Configuration:
        &nbsp;
        {conf.name}
        &nbsp;
        {Facade.metadata.getConfigTypeName(conf.type)}
        <mui.Divider />
      </div>
    );
  }

  render() {
    const entity = this.props.entity;
    const plugin = this.props.plugin;
    const clazz  = Facade.metadata.parseClass(plugin.clazz);
    const config = Facade.metadata.parseConfig(plugin.config);

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
          Version:
          &nbsp;
          {plugin.version}
          <mui.Divider />
          {clazz.actions.map(this.renderAction.bind(this))}
          {clazz.attributes.map(this.renderAttribute.bind(this))}
          {config.map(this.renderConfig.bind(this))}
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