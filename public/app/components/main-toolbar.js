'use strict';

import React from 'react';
import * as mui from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import base from './base/index';

import OnlineStore from '../stores/online-store';
import ProjectStore from '../stores/project-store';
import ActiveTabStore from '../stores/active-tab-store';

import Facade from '../services/facade';

import AppDispatcher from '../dispatcher/app-dispatcher';

import {
  dialogError, dialogSetBusy, dialogUnsetBusy,
  projectNew, projectLoadFile, projectLoadOnline, projectSaveOnline, projectSaveAs, projectSaveAllOnline
} from '../actions/index';

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

class MainToolbar extends React.Component {

  constructor(props) {
    super(props);

    const activeTabId = ActiveTabStore.getActiveTab();
    const activeProject = ProjectStore.get(activeTabId);

    this.state = { activeProject };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
    ActiveTabStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ActiveTabStore.removeChangeListener(this.boundHandleStoreChange);
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
  }

  handleStoreChange() {
    const activeTabId = ActiveTabStore.getActiveTab();
    const activeProject = ProjectStore.get(activeTabId);

    this.setState({ activeProject });
  }

  newVPanelProject() {
    projectNew('vpanel');
  }

  newUiProject() {
    projectNew('ui');
  }

  handleOpenFileVPanelProject(e) {
    const file = e.target.files[0];
    e.target.value = '';
    projectLoadFile(file, 'vpanel');
  }

  handleOpenFileUiProject(e) {
    const file = e.target.files[0];
    e.target.value = '';
    projectLoadFile(file, 'ui');
  }

  openFileVPanelProjectDialog() {
    this.refs.openFileVPanelProject.click();
  }

  openFileUiProjectDialog() {
    this.refs.openFileUiProject.click();
  }

  openOnlineVPanelProjectDialog() {
    this.setState({
      openOnlineVPanelProjectItems: OnlineStore.getResourceNames('project.vpanel.').map(name => name.substring('project.vpanel.'.length))
    });
  }

  openOnlineUiProjectDialog() {
    this.setState({
      openOnlineUiProjectItems: OnlineStore.getResourceNames('project.ui.').map(name => name.substring('project.ui.'.length))
    });
  }

  handleOpenOnlineVPanelProject(name) {
    this.setState({
      openOnlineVPanelProjectItems: null
    });
    if(!name) { return; }
    projectLoadOnline('project.vpanel.' + name, 'vpanel');
  }

  handleOpenOnlineUiProject(name) {
    this.setState({
      openOnlineUiProjectItems: null
    });
    if(!name) { return; }
    projectLoadOnline('project.ui.' + name, 'ui');
  }

  saveAll() {
    projectSaveAllOnline();
  }

  saveOnline() {
    const project = this.state.activeProject;
    projectSaveOnline(project);
  }

  saveAs() {
    const project = this.state.activeProject;
    projectSaveAs(project);
  }

  render() {
    const iconStyle = Object.assign({}, styles.icon, { fill: this.props.muiTheme.toolbar.iconColor});
    const project = this.state.activeProject;

    return (
      <mui.Toolbar>
        <mui.ToolbarGroup>
          <base.icons.tabs.VPanel style={iconStyle} />
          <mui.ToolbarTitle text="vpanel" />

          <mui.IconButton tooltip="new"
                          style={styles.button}
                          onClick={this.newVPanelProject.bind(this)}>
            <base.icons.actions.New />
          </mui.IconButton>
          <mui.IconButton tooltip="open online"
                          style={styles.button}
                          onClick={this.openOnlineVPanelProjectDialog.bind(this)}>
            <base.icons.actions.OpenOnline />
          </mui.IconButton>
          <mui.IconButton tooltip="open from file"
                          style={styles.button}
                          onClick={this.openFileVPanelProjectDialog.bind(this)}>
            <base.icons.actions.OpenFile />
          </mui.IconButton>

          <mui.ToolbarSeparator />

          <base.icons.tabs.Ui style={iconStyle} />
          <mui.ToolbarTitle text="ui"/>

          <mui.IconButton tooltip="new"
                          style={styles.button}
                          onClick={this.newUiProject.bind(this)}>
            <base.icons.actions.New />
          </mui.IconButton>
          <mui.IconButton tooltip="open online"
                          style={styles.button}
                          onClick={this.openOnlineUiProjectDialog.bind(this)}>
            <base.icons.actions.OpenOnline />
          </mui.IconButton>
          <mui.IconButton tooltip="open from file"
                          style={styles.button}
                          onClick={this.openFileUiProjectDialog.bind(this)}>
            <base.icons.actions.OpenFile />
          </mui.IconButton>

          <mui.ToolbarSeparator />

          <mui.IconButton tooltip="save all"
                          style={styles.button}
                          onClick={this.saveAll.bind(this)}>
            <base.icons.actions.SaveAll />
          </mui.IconButton>
          <mui.IconButton tooltip="save online"
                          style={styles.button}
                          disabled={!project}
                          onClick={this.saveOnline.bind(this)}>
            <base.icons.actions.Save />
          </mui.IconButton>
          <mui.IconButton tooltip="save as"
                          style={styles.button}
                          disabled={!project}
                          onClick={this.saveAs.bind(this)}>
            <base.icons.actions.SaveAs />
          </mui.IconButton>
        </mui.ToolbarGroup>

        <input
          ref="openFileVPanelProject"
          type="file"
          style={{display : 'none'}}
          onChange={base.utils.stopPropagationWrapper(this.handleOpenFileVPanelProject.bind(this))}/>

        <input
          ref="openFileUiProject"
          type="file"
          style={{display : 'none'}}
          onChange={base.utils.stopPropagationWrapper(this.handleOpenFileUiProject.bind(this))}/>

        <base.DialogSelect title="Select VPanel Project"
                           open={!!this.state.openOnlineVPanelProjectItems}
                           items={this.state.openOnlineVPanelProjectItems || []}
                           select={this.handleOpenOnlineVPanelProject.bind(this)}
                           cancel={this.handleOpenOnlineVPanelProject.bind(this, null)}/>

        <base.DialogSelect title="Select UI Project"
                           open={!!this.state.openOnlineUiProjectItems}
                           items={this.state.openOnlineUiProjectItems || []}
                           select={this.handleOpenOnlineUiProject.bind(this)}
                           cancel={this.handleOpenOnlineUiProject.bind(this, null)}/>
      </mui.Toolbar>
    );
  }
}

export default muiThemeable()(MainToolbar);
