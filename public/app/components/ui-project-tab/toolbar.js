'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';
import DialogOperationSelect from '../base/dialog-operation-select';
import DialogConfirm from '../base/dialog-confirm';
import DialogInfo from '../base/dialog-info';

import AppDispatcher from '../../dispatcher/app-dispatcher';
import {
  dialogSetBusy, dialogError,
  projectNewImage, projectNewWindow,
  resourcesGetQuery
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

  closeInfo() {
    this.setState({ showInfo: null });
  }

  newImage() {
    projectNewImage(this.props.project);
  }

  newWindow() {
    projectNewWindow(this.props.project);
  }

  // import

  importOnline() {
    const project = this.props.project;
    AppDispatcher.dispatch(dialogSetBusy('Preparing import'));
    Facade.projects.uiPrepareImportOnline(project, (err, data) => {
      AppDispatcher.dispatch(dialogSetBusy());
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
      AppDispatcher.dispatch(dialogSetBusy());
      const err = reader.error;
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }
      const content = reader.result;
      let project;
      try {
        project = Facade.projects.open('vpanel', content, true);
      } catch(err) {
        return AppDispatcher.dispatch(dialogError(err));
      }
      return this.importProject(project);
    };

    reader.readAsText(file);
  }

  handleOpenOnlineVPanelProject(name) {
    this.loadProjectOnline('project.vpanel.' + name, 'vpanel');
  }

  loadProjectOnline(resource, type) {
    const load = (content) => {
      let project;
      try {
        project = Facade.projects.open(type, content, true);
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
    return resourcesGetQuery(entity.id, resource, (err, content) => {
      AppDispatcher.dispatch(dialogSetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }
      return load(content);
    });
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

    this.setState({
      showInfo: ['Components imported']
    });
  }

  // deploy

  deploy() {
    const project = this.props.project;
    AppDispatcher.dispatch(dialogSetBusy('Preparing deploy'));
    Facade.projects.uiPrepareDeploy(project, (err, data) => {
      AppDispatcher.dispatch(dialogSetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }

      this.setState({
        showOperationSelect: data.operations
      });
    });
  }

  executeOperations() {
    const data = {
      project: this.props.project,
      operations: this.state.showOperationSelect
    };
    this.setState({
      showOperationSelect: null
    });

    AppDispatcher.dispatch(dialogSetBusy('Executing deploy'));
    Facade.projects.executeDeploy(data, (err) => {
      AppDispatcher.dispatch(dialogSetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }

      this.setState({
        showInfo: ['Deploy done']
      });
    });
  }

  cancelExecuteOperations() {
    this.setState({
      showOperationSelect: null
    });
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

            <base.IconSelectButton tooltip="Import UI components from online project"
                                   tooltipPosition="top-center"
                                   style={styles.button}
                                   selectTitle="Select VPanel Project"
                                   selectItems={OnlineStore.getResourceNames('project.vpanel.').map(name => name.substring('project.vpanel.'.length))}
                                   onItemSelect={(name) => this.handleOpenOnlineVPanelProject(name)}>
              <base.icons.actions.OpenOnline />
            </base.IconSelectButton>

            <base.IconFileButton tooltip="Import UI components from file project"
                                 tooltipPosition="top-center"
                                 style={styles.button}
                                 onFileSelected={(file) => this.handleOpenFileVPanelProject(file)}>
              <base.icons.actions.OpenFile />
            </base.IconFileButton>

            <mui.IconButton tooltip="Deploy project"
                            tooltipPosition="top-center"
                            onClick={this.deploy.bind(this)}
                            style={styles.button}>
              <base.icons.tabs.Online />
            </mui.IconButton>

          </mui.ToolbarGroup>
        </mui.Toolbar>

        <DialogOperationSelect open={!!this.state.showOperationSelect}
                               operations={this.state.showOperationSelect || []}
                               ok={this.executeOperations.bind(this)}
                               cancel={this.cancelExecuteOperations.bind(this)}/>

        <DialogConfirm title="Confirm"
                       open={!!this.state.importComponentsConfirm}
                       lines={(this.state.importComponentsConfirm && ['The following elements will be lost:'].concat(this.state.importComponentsConfirm.messages)) || []}
                       yes={this.confirmImportComponents.bind(this)}
                       no={this.cancelImportComponents.bind(this)}/>

        <DialogInfo title="Success"
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