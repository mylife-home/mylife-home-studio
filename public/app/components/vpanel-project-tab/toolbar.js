'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';

import AppDispatcher from '../../compat/dispatcher';
import {
  projectVPanelImportOnlineToolbox, projectVPanelImportOnlineDriverComponents,
  projectVPanelPrepareDeployVPanel, projectVPanelPrepareDeployDrivers
} from '../../actions/index';

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

class Toolbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  // importOnlineToolbox

  importOnlineToolbox() {
    AppDispatcher.dispatch(projectVPanelImportOnlineToolbox(this.props.project.uid));
  }

  // ---

  importOnlineDriverComponents() {
    AppDispatcher.dispatch(projectVPanelImportOnlineDriverComponents(this.props.project.uid));
  }

  deployVPanel() {
    AppDispatcher.dispatch(projectVPanelPrepareDeployVPanel(this.props.project.uid));
  }

  deployDrivers() {
    AppDispatcher.dispatch(projectVPanelPrepareDeployDrivers(this.props.project.uid));
  }

  render() {
    return (
      <mui.Toolbar>
        <mui.ToolbarGroup>

          <mui.IconButton tooltip="Import toolbox from online entities"
                          tooltipPosition="top-right"
                          onClick={this.importOnlineToolbox.bind(this)}
                          style={styles.button}>
            <icons.PluginDriver />
          </mui.IconButton>

          <mui.IconButton tooltip="Import driver components from online entities"
                          tooltipPosition="top-right"
                          onClick={this.importOnlineDriverComponents.bind(this)}
                          style={styles.button}>
            <icons.Component />
          </mui.IconButton>

          <mui.IconButton tooltip={<div>Deploy vpanel project<br/>(replace vpanel and ui components on all entities)</div>}
                          tooltipPosition="top-center"
                          onClick={this.deployVPanel.bind(this)}
                          style={styles.button}>
            <icons.tabs.Online />
          </mui.IconButton>

          <mui.IconButton tooltip={<div>Deploy driver project<br/>(replace driver components on targeted entities)</div>}
                          tooltipPosition="top-center"
                          onClick={this.deployDrivers.bind(this)}
                          style={styles.button}>
            <icons.tabs.Online />
          </mui.IconButton>

        </mui.ToolbarGroup>
      </mui.Toolbar>
    );
  }
}

Toolbar.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Toolbar;
