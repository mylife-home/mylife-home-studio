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

  // import

  importProjectOnline() {
    // TODO
  }

  importProjectFile() {
    // TODO
  }

  importOnline() {
    const project = this.props.project;
    DialogsActionCreators.setBusy('Preparing import');
    Facade.projects.uiPrepareImportOnline(project, (err, data) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }

      if(data.messages && data.messages.length) {
        this.setState({
          importComponentsConfirm: data
        });
        return;
      }

      this.executeImportComponents(data);
    });
  }

  cancelImportOnlineToolbox() {
    this.setState({ importComponentsConfirm: null });
  }

  confirmImportOnlineToolbox() {
    const data = this.state.importComponentsConfirm;
    this.setState({ importComponentsConfirm: null });
    this.executeImportComponents(data);
  }

  executeImportComponents(data) {
    DialogsActionCreators.setBusy('Executing import');
    Facade.projects.uiExecuteImport(data, (err) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }

      this.setState({
        showInfo: ['Toolbox imported']
      });
    });
  }

  // deploy

  deploy() {
    const project = this.props.project;
    DialogsActionCreators.setBusy('Preparing deploy');
    Facade.projects.uiPrepareDeploy(project, (err, data) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }

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

    DialogsActionCreators.setBusy('Executing deploy');
    Facade.projects.uiExecuteDeploy(data, (err) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }

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

        <base.DialogOperationSelect open={!!this.state.showOperationSelect}
                                    operations={this.state.showOperationSelect || []}
                                    ok={this.executeOperations.bind(this)}
                                    cancel={this.cancelExecuteOperations.bind(this)}/>

        <base.DialogConfirm title="Confirm"
                            open={!!this.state.importComponentsConfirm}
                            lines={(this.state.importComponentsConfirm && this.state.importComponentsConfirm.messages) || []}
                            yes={this.confirmImportComponents.bind(this)}
                            no={this.cancelImportComponents.bind(this)}/>

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