'use strict';

import React from 'react';
import * as mui from 'material-ui';

import Toolbar from './toolbar';
import ToolboxPlugin from './toolbox-plugin';

import tabStyles from '../base/tab-styles';

const styles = {
  pluginList: {
    height: 'calc(100% - 74px)'
  }
};

const Toolbox = ({ toolbox, onNewComponent, onImportOnlineToolbox, onImportOnlineDriverComponents, onDeployVPanel, onDeployDrivers }) => {

  const items = [];

  toolbox.forEach(item => {
    const { entityId, plugins } = item;
    const entityName = entityId.substr(entityId.indexOf('_') + 1);

    items.push(<mui.Subheader key={entityId}>{entityName}</mui.Subheader>);

    plugins.forEach(plugin => {
      items.push(
        <mui.ListItem key={`${entityId}:${plugin.library}:${plugin.type}`}>
          <ToolboxPlugin plugin={plugin} onNewComponent={onNewComponent}></ToolboxPlugin>
        </mui.ListItem>
      );
    });
  });

  return (
    <div style={Object.assign({}, tabStyles.fullHeight)}>
      <mui.List style={Object.assign({}, tabStyles.scrollable, styles.pluginList)}>
        {items}
      </mui.List>
      <Toolbar onImportOnlineToolbox={onImportOnlineToolbox}
               onImportOnlineDriverComponents={onImportOnlineDriverComponents}
               onDeployVPanel={onDeployVPanel}
               onDeployDrivers={onDeployDrivers} />
    </div>
  );
};

Toolbox.propTypes = {
  toolbox                        : React.PropTypes.array.isRequired,
  onNewComponent                 : React.PropTypes.func.isRequired,
  onImportOnlineToolbox          : React.PropTypes.func.isRequired,
  onImportOnlineDriverComponents : React.PropTypes.func.isRequired,
  onDeployVPanel                 : React.PropTypes.func.isRequired,
  onDeployDrivers                : React.PropTypes.func.isRequired
};

export default Toolbox;

