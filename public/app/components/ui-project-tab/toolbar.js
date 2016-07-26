'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';
import DialogsActionCreators from '../../actions/dialogs-action-creators';

import Facade from '../../services/facade';

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

  closeInfo() {
    this.setState({ showInfo: null });
  }

  select(data) {
    const project = this.props.project;
    const state = ProjectStateStore.getProjectState(project);
    state.activeContent = data;
    state.selection = data;
    ProjectActionCreators.stateRefresh(project);
  }

  newImage() {
    const project = this.props.project;
    const image = Facade.projects.uiCreateImage(project);

    this.select({ type: 'image', uid: image.uid });
  }

  newWindow() {
    const project = this.props.project;
    const window = Facade.projects.uiCreateWindow(project);

    this.select({ type: 'window', uid: window.uid });
  }

  importOnline() {
    // TODO
  }

  importProjectOnline() {
    // TODO
  }

  importProjectFile() {
    // TODO
  }

  deploy() {
    // TODO
  }

  render() {
    const project = this.props.project;

    return (
      <div>
        <mui.Toolbar>
          <mui.ToolbarGroup>

            <mui.IconButton tooltip="New image"
                            tooltipPosition="top-right"
                            onClick={this.newImage.bind(this)}
                            style={styles.button}>
              <base.icons.actions.NewImage />
            </mui.IconButton>

            <mui.IconButton tooltip="New window"
                            tooltipPosition="top-right"
                            onClick={this.newWindow.bind(this)}
                            style={styles.button}>
              <base.icons.actions.NewWindow />
            </mui.IconButton>

            <mui.IconButton tooltip="Import UI components from online entities"
                            tooltipPosition="top-center"
                            onClick={this.importOnline.bind(this)}
                            style={styles.button}>
              <base.icons.actions.Refresh />
            </mui.IconButton>

            <mui.IconButton tooltip="Import UI components from online project"
                            tooltipPosition="top-center"
                            onClick={this.importProjectOnline.bind(this)}
                            style={styles.button}>
              <base.icons.actions.OpenOnline />
            </mui.IconButton>

            <mui.IconButton tooltip="Import UI components from file project"
                            tooltipPosition="top-center"
                            onClick={this.importProjectFile.bind(this)}
                            style={styles.button}>
              <base.icons.actions.OpenFile />
            </mui.IconButton>

            <mui.IconButton tooltip="Deploy project"
                            tooltipPosition="top-center"
                            onClick={this.deploy.bind(this)}
                            style={styles.button}>
              <base.icons.tabs.Online />
            </mui.IconButton>

          </mui.ToolbarGroup>
        </mui.Toolbar>

        <base.DialogInfo title="Success"
                         open={!!this.state.showInfo}
                         lines={this.state.showInfo || []}
                         close={this.closeInfo.bind(this)}/>
      </div>
    );
  }
}

Toolbar.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Toolbar;