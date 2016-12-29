'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';

import AppDispatcher from '../../compat/dispatcher';
import {
  dialogSetBusy, dialogUnsetBusy, dialogError, dialogOpenOperations, dialogExecuteOperations,
  projectNewImage, projectNewWindow,
  projectUiImportOnline, projectUiImportVPanelProjectFile, projectUiImportVPanelProjectOnline
} from '../../actions/index';
import storeHandler from '../../compat/store';
import { getVPanelProjectNames } from'../../selectors/online';

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

  newImage() {
    AppDispatcher.dispatch(projectNewImage(this.props.project.uid));
  }

  newWindow() {
    AppDispatcher.dispatch(projectNewWindow(this.props.project.uid));
  }

  // import

  importOnline() {
    AppDispatcher.dispatch(projectUiImportOnline(this.props.project.uid));
  }

  handleOpenFileVPanelProject(file) {
    AppDispatcher.dispatch(projectUiImportVPanelProjectFile(this.props.project.uid, file));
  }

  handleOpenOnlineVPanelProject(name) {
    AppDispatcher.dispatch(projectUiImportVPanelProjectOnline(this.props.project.uid, name));
  }

  // deploy

  deploy() {
    const project = this.props.project;
    AppDispatcher.dispatch(dialogSetBusy('Preparing deploy'));
    Facade.projects.uiPrepareDeploy(project, (err, data) => {
      AppDispatcher.dispatch(dialogUnsetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }

      AppDispatcher.dispatch(dialogOpenOperations(data.operations));
    });
  }

  executeOperations() {
    AppDispatcher.dispatch(dialogExecuteOperations());
  }

  render() {
    return (
      <mui.Toolbar>
        <mui.ToolbarGroup>

          <mui.IconButton tooltip="New image"
                          tooltipPosition="top-right"
                          onClick={this.newImage.bind(this)}
                          style={styles.button}>
            <icons.actions.NewImage />
          </mui.IconButton>

          <mui.IconButton tooltip="New window"
                          tooltipPosition="top-right"
                          onClick={this.newWindow.bind(this)}
                          style={styles.button}>
            <icons.actions.NewWindow />
          </mui.IconButton>

          <mui.IconButton tooltip="Import UI components from online entities"
                          tooltipPosition="top-center"
                          onClick={this.importOnline.bind(this)}
                          style={styles.button}>
            <icons.actions.Refresh />
          </mui.IconButton>

          <base.IconSelectButton tooltip="Import UI components from online project"
                                 tooltipPosition="top-center"
                                 style={styles.button}
                                 selectTitle="Select VPanel Project"
                                 selectItems={getVPanelProjectNames(storeHandler.getStore().getState())}
                                 onItemSelect={(name) => this.handleOpenOnlineVPanelProject(name)}>
            <icons.actions.OpenOnline />
          </base.IconSelectButton>

          <base.IconFileButton tooltip="Import UI components from file project"
                               tooltipPosition="top-center"
                               style={styles.button}
                               onFileSelected={(file) => this.handleOpenFileVPanelProject(file)}>
            <icons.actions.OpenFile />
          </base.IconFileButton>

          <mui.IconButton tooltip="Deploy project"
                          tooltipPosition="top-center"
                          onClick={this.deploy.bind(this)}
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