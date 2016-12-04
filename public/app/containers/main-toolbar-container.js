'use strict';

import React from 'react';

import MainToolbar from '../components/main-toolbar';

import OnlineStore from '../stores/online-store';
import ProjectStore from '../stores/project-store';
import ActiveTabStore from '../stores/active-tab-store';

import Facade from '../services/facade';

import AppDispatcher from '../dispatcher/app-dispatcher';

import {
  dialogError, dialogSetBusy, dialogUnsetBusy,
  projectNew, projectLoadFile, projectLoadOnline, projectSaveOnline, projectSaveAs, projectSaveAllOnline
} from '../actions/index';

class MainToolbarContainer extends React.Component {

  constructor(props) {
    super(props);

    const activeTabId = ActiveTabStore.getActiveTab();
    const activeProject = ProjectStore.get(activeTabId);
    const onlineVPanelProjectList = OnlineStore.getResourceNames('project.vpanel.').map(name => name.substring('project.vpanel.'.length));
    const onlineUiProjectList = OnlineStore.getResourceNames('project.ui.').map(name => name.substring('project.ui.'.length));

    this.state = { activeProject, onlineVPanelProjectList, onlineUiProjectList };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    OnlineStore.addChangeListener(this.boundHandleStoreChange);
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
    ActiveTabStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ActiveTabStore.removeChangeListener(this.boundHandleStoreChange);
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
    OnlineStore.removeChangeListener(this.boundHandleStoreChange);
  }

  handleStoreChange() {
    const activeTabId = ActiveTabStore.getActiveTab();
    const activeProject = ProjectStore.get(activeTabId);
    const onlineVPanelProjectList = OnlineStore.getResourceNames('project.vpanel.').map(name => name.substring('project.vpanel.'.length));
    const onlineUiProjectList = OnlineStore.getResourceNames('project.ui.').map(name => name.substring('project.ui.'.length));

    this.setState({ activeProject, onlineVPanelProjectList, onlineUiProjectList });
  }

  newVPanelProject() {
    projectNew('vpanel');
  }

  newUiProject() {
    projectNew('ui');
  }

  handleOpenFileVPanelProject(file) {
    projectLoadFile(file, 'vpanel');
  }

  handleOpenFileUiProject(file) {
    projectLoadFile(file, 'ui');
  }

  handleOpenOnlineVPanelProject(name) {
    projectLoadOnline('project.vpanel.' + name, 'vpanel');
  }

  handleOpenOnlineUiProject(name) {
    projectLoadOnline('project.ui.' + name, 'ui');
  }

  saveAll() {
    projectSaveAllOnline();
  }

  saveOnline(project) {
    projectSaveOnline(project);
  }

  saveAs(project) {
    projectSaveAs(project);
  }

  render() {
    return (
      <MainToolbar
        activeProject={this.state.activeProject}
        onlineVPanelProjectList={this.state.onlineVPanelProjectList}
        onlineUiProjectList={this.state.onlineUiProjectList}
        newVPanelProject={this.newVPanelProject.bind(this)}
        newUiProject={this.newUiProject.bind(this)}
        handleOpenFileVPanelProject={this.handleOpenFileVPanelProject.bind(this)}
        handleOpenFileUiProject={this.handleOpenFileUiProject.bind(this)}
        handleOpenOnlineVPanelProject={this.handleOpenOnlineVPanelProject.bind(this)}
        handleOpenOnlineUiProject={this.handleOpenOnlineUiProject.bind(this)}
        saveAll={this.saveAll.bind(this)}
        saveOnline={this.saveOnline.bind(this)}
        saveAs={this.saveAs.bind(this)}
      />
    );
  }
}

export default MainToolbarContainer;
