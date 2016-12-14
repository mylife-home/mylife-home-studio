'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';
import DialogConfirm from '../dialogs/dialog-confirm';

import { projectTypes } from '../../constants/index';
import AppDispatcher from '../../compat/dispatcher';
import {
  dialogSetBusy, dialogUnsetBusy, dialogError, dialogOpenOperations, dialogInfo, dialogExecuteOperations,
  projectNewImage, projectNewWindow,
  resourcesGet
} from '../../actions/index';

import OnlineStore from '../../stores/online-store';

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
    AppDispatcher.dispatch(projectNewImage(this.props.project));
  }

  newWindow() {
    AppDispatcher.dispatch(projectNewWindow(this.props.project));
  }

  // import

  importOnline() {
    const project = this.props.project;
    AppDispatcher.dispatch(dialogSetBusy('Preparing import'));
    Facade.projects.uiPrepareImportOnline(project, (err, data) => {
      AppDispatcher.dispatch(dialogUnsetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }

      if(data.messages && data.messages.length) {
        this.setState({
          importComponentsConfirm: data
        });
        return;
      }

      this.executeImportComponents(data);
    });
  }

  handleOpenFileVPanelProject(file) {
    const reader = new FileReader();

    AppDispatcher.dispatch(dialogSetBusy('Loading project'));

    reader.onloadend = () => {
      AppDispatcher.dispatch(dialogUnsetBusy());
      const err = reader.error;
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }
      const content = reader.result;
      let project;
      try {
        project = Facade.projects.open(projectTypes.VPANEL, content);
      } catch(err) {
        return AppDispatcher.dispatch(dialogError(err));
      }
      return this.importProject(project);
    };

    reader.readAsText(file);
  }

  handleOpenOnlineVPanelProject(name) {
    this.loadProjectOnline('project.vpanel.' + name, projectTypes.VPANEL);
  }

  loadProjectOnline(resource, type) {
    const load = (content) => {
      let project;
      try {
        project = Facade.projects.open(type, content);
      } catch(err) {
        return AppDispatcher.dispatch(dialogError(err));
      }
      return this.importProject(project);
    };

    const entity = OnlineStore.getResourceEntity();
    const cachedContent = entity.cachedResources && entity.cachedResources[resource];
    if(cachedContent) {
      return load(cachedContent);
    }

    // need to get content .. TODO: Flux pattern to do that ?
    AppDispatcher.dispatch(dialogSetBusy('Loading project'));
    return AppDispatcher.dispatch(resourcesGet(entity.id, resource, (err, content) => {
      AppDispatcher.dispatch(dialogUnsetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }
      return load(content);
    }));
  }

  importProject(vpanelProject) {
    const project = this.props.project;
    let data;
    try {
      data = Facade.projects.uiPrepareImportVpanelProject(project, vpanelProject);
    } catch(err) {
      return AppDispatcher.dispatch(dialogError(err));
    }

    if(data.messages && data.messages.length) {
      this.setState({
        importComponentsConfirm: data
      });
      return;
    }

    this.executeImportComponents(data);
  }

  cancelImportComponents() {
    this.setState({ importComponentsConfirm: null });
  }

  confirmImportComponents() {
    const data = this.state.importComponentsConfirm;
    this.setState({ importComponentsConfirm: null });
    this.executeImportComponents(data);
  }

  executeImportComponents(data) {
    try {
      Facade.projects.uiExecuteImport(data);
    } catch(err) {
      return AppDispatcher.dispatch(dialogError(err));
    }

    AppDispatcher.dispatch(dialogInfo({ title: 'Success', lines: ['Components imported'] }));
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
      <div>
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
                                   selectItems={OnlineStore.getResourceNames('project.vpanel.')}
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

        <DialogConfirm title="Confirm"
                       open={!!this.state.importComponentsConfirm}
                       lines={(this.state.importComponentsConfirm && ['The following elements will be lost:'].concat(this.state.importComponentsConfirm.messages)) || []}
                       yes={this.confirmImportComponents.bind(this)}
                       no={this.cancelImportComponents.bind(this)}/>
      </div>
    );
  }
}

Toolbar.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Toolbar;