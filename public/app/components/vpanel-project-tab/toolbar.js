'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';
import DialogOperationSelect from '../base/dialog-operation-select';
import DialogConfirm from '../dialogs/dialog-confirm';
import DialogInfo from '../dialogs/dialog-info';

import AppDispatcher from '../../dispatcher/app-dispatcher';
import {
  dialogSetBusy, dialogError
} from '../../actions/index';

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

  // importOnlineToolbox

  importOnlineToolbox() {
    const { project } = this.props;
    AppDispatcher.dispatch(dialogSetBusy('Preparing import'));
    Facade.projects.vpanelPrepareImportOnlineToolbox(project, (err, data) => {
      AppDispatcher.dispatch(dialogSetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }

      if(data.messages && data.messages.length) {
        this.setState({
          importOnlineToolboxConfirm: data
        });
        return;
      }

      this.executeImportOnlineToolbox(data);
    });
  }

  cancelImportOnlineToolbox() {
    this.setState({ importOnlineToolboxConfirm: null });
  }

  confirmImportOnlineToolbox() {
    const data = this.state.importOnlineToolboxConfirm;
    this.setState({ importOnlineToolboxConfirm: null });
    this.executeImportOnlineToolbox(data);
  }

  executeImportOnlineToolbox(data) {
    AppDispatcher.dispatch(dialogSetBusy('Executing import'));
    Facade.projects.vpanelExecuteImportOnlineToolbox(data, (err) => {
      AppDispatcher.dispatch(dialogSetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }

      this.setState({
        showInfo: ['Toolbox imported']
      });
    });
  }

  // ---

  importOnlineDriverComponents() {
    const project = this.props.project;
    AppDispatcher.dispatch(dialogSetBusy('Executing import'));
    Facade.projects.vpanelImportOnlineDriverComponents(project, (err) => {
      AppDispatcher.dispatch(dialogSetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }

      this.setState({
        showInfo: ['Components imported']
      });
    });
  }

  deployVPanel() {
    const project = this.props.project;
    AppDispatcher.dispatch(dialogSetBusy('Preparing deploy'));
    Facade.projects.vpanelPrepareDeployVPanel(project, (err, data) => {
      AppDispatcher.dispatch(dialogSetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }

      this.setState({
        showOperationSelect: data.operations
      });
    });
  }

  deployDrivers() {
    const project = this.props.project;
    AppDispatcher.dispatch(dialogSetBusy('Preparing deploy'));
    Facade.projects.vpanelPrepareDeployDrivers(project, (err, data) => {
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

            <mui.IconButton tooltip="Import toolbox from online entities"
                            tooltipPosition="top-right"
                            onClick={this.importOnlineToolbox.bind(this)}
                            style={styles.button}>
              <base.icons.PluginDriver />
            </mui.IconButton>

            <mui.IconButton tooltip="Import driver components from online entities"
                            tooltipPosition="top-right"
                            onClick={this.importOnlineDriverComponents.bind(this)}
                            style={styles.button}>
              <base.icons.Component />
            </mui.IconButton>

            <mui.IconButton tooltip={<div>Deploy vpanel project<br/>(replace vpanel and ui components on all entities)</div>}
                            tooltipPosition="top-center"
                            onClick={this.deployVPanel.bind(this)}
                            style={styles.button}>
              <base.icons.tabs.Online />
            </mui.IconButton>

            <mui.IconButton tooltip={<div>Deploy driver project<br/>(replace driver components on targeted entities)</div>}
                            tooltipPosition="top-center"
                            onClick={this.deployDrivers.bind(this)}
                            style={styles.button}>
              <base.icons.tabs.Online />
            </mui.IconButton>

          </mui.ToolbarGroup>
        </mui.Toolbar>

        <DialogInfo title="Success"
                    open={!!this.state.showInfo}
                    lines={this.state.showInfo || []}
                    close={this.closeInfo.bind(this)}/>

        <DialogConfirm title="Confirm"
                       open={!!this.state.importOnlineToolboxConfirm}
                       lines={(this.state.importOnlineToolboxConfirm && this.state.importOnlineToolboxConfirm.messages) || []}
                       yes={this.confirmImportOnlineToolbox.bind(this)}
                       no={this.cancelImportOnlineToolbox.bind(this)}/>

        <DialogOperationSelect open={!!this.state.showOperationSelect}
                               operations={this.state.showOperationSelect || []}
                               ok={this.executeOperations.bind(this)}
                               cancel={this.cancelExecuteOperations.bind(this)}/>

      </div>
    );
  }
}

Toolbar.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Toolbar;
