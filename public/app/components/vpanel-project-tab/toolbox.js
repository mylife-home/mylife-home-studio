'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectActionCreators from '../../actions/project-action-creators';

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

class Toolbox extends React.Component {

  constructor(props) {
    super(props);
  }

  importOnlineToolbox() {
    const project = this.props.project;
    ProjectActionCreators.vPanelImportToolbox(project);
  }

  importOnlineDriverComponents() {
    const project = this.props.project;
    ProjectActionCreators.vPanelImportDrivers(project);
  }

  deployVPanel() {
    const project = this.props.project;
    ProjectActionCreators.vPanelDeployVPanel(project);
  }

  deployDrivers() {
    const project = this.props.project;
    ProjectActionCreators.vPanelDeployDrivers(project);
  }

  render() {
    const project = this.props.project;

    return (
      <div>
        TOOLBOX
        <ul>
          {project.toolbox.map((item) => (
            <li key={item.entityId}>
              {item.entityId}
              <ul>
                {item.plugins.map((plugin) => (
                  <li key={plugin.library + ':' + plugin.type}>
                    {plugin.library + ':' + plugin.type}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <mui.Toolbar>
          <mui.ToolbarGroup float="left">

            <mui.IconButton tooltip="Import toolbox from online entities"
                            onClick={this.importOnlineToolbox.bind(this)}
                            style={styles.button}>
              <base.icons.PluginDriver />
            </mui.IconButton>

            <mui.IconButton tooltip="Import driver components from online entities"
                            onClick={this.importOnlineDriverComponents.bind(this)}
                            style={styles.button}>
              <base.icons.Component />
            </mui.IconButton>

            <mui.IconButton tooltip="Deploy vpanel project (replace vpanel and ui components on all entities)"
                            onClick={this.deployVPanel.bind(this)}
                            style={styles.button}>
              <base.icons.tabs.Online />
            </mui.IconButton>

            <mui.IconButton tooltip="Deploy driver project (replace driver components on targeted entities)"
                            onClick={this.deployDrivers.bind(this)}
                            style={styles.button}>
              <base.icons.tabs.Online />
            </mui.IconButton>

          </mui.ToolbarGroup>
        </mui.Toolbar>
      </div>
    );
  }
}

Toolbox.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Toolbox;
