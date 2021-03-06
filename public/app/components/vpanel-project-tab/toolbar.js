'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';

const styles = {
  icon: {
    margin: 16,
  },
  button: {
    height: '56px',
    width: '56px',
    overflow: 'inherit'
  }
};

const Toolbar = ({ onImportOnlineToolbox, onImportOnlineDriverComponents, onDeployVPanel, onDeployDrivers }) => (
  <mui.Toolbar>
    <mui.ToolbarGroup>

      <mui.IconButton tooltip="Import toolbox from online entities"
                      tooltipPosition="top-right"
                      onClick={onImportOnlineToolbox}
                      style={styles.button}>
        <icons.PluginDriver />
      </mui.IconButton>

      <mui.IconButton tooltip="Import driver components from online entities"
                      tooltipPosition="top-right"
                      onClick={onImportOnlineDriverComponents}
                      style={styles.button}>
        <icons.Component />
      </mui.IconButton>

      <mui.IconButton tooltip={<div>Deploy vpanel project<br/>(replace vpanel and ui components on all entities)</div>}
                      tooltipPosition="top-center"
                      onClick={onDeployVPanel}
                      style={styles.button}>
        <icons.tabs.Online />
      </mui.IconButton>

      <mui.IconButton tooltip={<div>Deploy driver project<br/>(replace driver components on targeted entities)</div>}
                      tooltipPosition="top-center"
                      onClick={onDeployDrivers}
                      style={styles.button}>
        <icons.tabs.Online />
      </mui.IconButton>

    </mui.ToolbarGroup>
  </mui.Toolbar>
);

Toolbar.propTypes = {
  onImportOnlineToolbox          : React.PropTypes.func.isRequired,
  onImportOnlineDriverComponents : React.PropTypes.func.isRequired,
  onDeployVPanel                 : React.PropTypes.func.isRequired,
  onDeployDrivers                : React.PropTypes.func.isRequired
};

export default Toolbar;
