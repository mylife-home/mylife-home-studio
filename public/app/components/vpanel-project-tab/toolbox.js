'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';
import DialogOperationSelect from './dialog-operation-select';

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

class Toolbox extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  closeInfo() {
    this.setState({ showInfo: null });
  }

  // importOnlineToolbox

  importOnlineToolbox() {
    const project = this.props.project;
    DialogsActionCreators.setBusy('Preparing import');
    Facade.projects.vpanelPrepareImportOnlineToolbox(project, (err, data) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }

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
    DialogsActionCreators.setBusy('Executing import');
    Facade.projects.vpanelExecuteImportOnlineToolbox(data, (err) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }

      this.setState({
        showInfo: ['Toolbox imported']
      });
    });
  }

  // ---

  importOnlineDriverComponents() {
    const project = this.props.project;
    DialogsActionCreators.setBusy('Executing import');
    Facade.projects.vpanelImportOnlineDriverComponents(project, (err) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }

      this.setState({
        showInfo: ['Components imported']
      });
    });
  }

  deployVPanel() {
    const project = this.props.project;
    DialogsActionCreators.setBusy('Preparing deploy');
    Facade.projects.vpanelPrepareDeployVPanel(project, (err, data) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }

      this.setState({
        showOperationSelect: data.operations
      });
    });
  }

  deployDrivers() {
    const project = this.props.project;
    DialogsActionCreators.setBusy('Preparing deploy');
    Facade.projects.vpanelPrepareDeployDrivers(project, (err, data) => {
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
    Facade.projects.vpanelExecuteDeploy(data, (err) => {
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

        <base.DialogInfo title="Success"
                         open={!!this.state.showInfo}
                         lines={this.state.showInfo || []}
                         close={this.closeInfo.bind(this)}/>

        <base.DialogConfirm title="Confirm"
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

Toolbox.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Toolbox;
