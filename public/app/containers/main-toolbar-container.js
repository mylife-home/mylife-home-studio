'use strict';

import React from 'react';

import MainToolbar from '../components/main-toolbar';

import OnlineStore from '../stores/online-store';
import ProjectStore from '../stores/project-store';
import storeHandler from '../compat/store';

import { projectTypes } from '../constants/index';

import AppDispatcher from '../compat/dispatcher';
import {
  projectNew, projectLoadFile, projectLoadOnline, projectSaveOnline, projectSaveAs, projectSaveAllOnline
} from '../actions/index';

class MainToolbarContainer extends React.Component {

  constructor(props) {
    super(props);

    const activeTabId = storeHandler.getStore().getState().activeTab;
    const activeProject = ProjectStore.get(activeTabId);
    const onlineVPanelProjectList = OnlineStore.getResourceNames('project.vpanel.').map(name => name.substring('project.vpanel.'.length));
    const onlineUiProjectList = OnlineStore.getResourceNames('project.ui.').map(name => name.substring('project.ui.'.length));

    this.state = { activeProject, onlineVPanelProjectList, onlineUiProjectList };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = storeHandler.getStore().subscribe(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleStoreChange() {
    const activeTabId = storeHandler.getStore().getState().activeTab;
    const activeProject = ProjectStore.get(activeTabId);
    const onlineVPanelProjectList = OnlineStore.getResourceNames('project.vpanel.').map(name => name.substring('project.vpanel.'.length));
    const onlineUiProjectList = OnlineStore.getResourceNames('project.ui.').map(name => name.substring('project.ui.'.length));

    this.setState({ activeProject, onlineVPanelProjectList, onlineUiProjectList });
  }

  newVPanelProject() {
    AppDispatcher.dispatch(projectNew(projectTypes.VPANEL));
  }

  newUiProject() {
    AppDispatcher.dispatch(projectNew(projectTypes.UI));
  }

  openFileVPanelProject(file) {
    AppDispatcher.dispatch(projectLoadFile(file, projectTypes.VPANEL));
  }

  openFileUiProject(file) {
    AppDispatcher.dispatch(projectLoadFile(file, projectTypes.UI));
  }

  openOnlineVPanelProject(name) {
    AppDispatcher.dispatch(projectLoadOnline('project.vpanel.' + name, projectTypes.VPANEL));
  }

  openOnlineUiProject(name) {
    AppDispatcher.dispatch(projectLoadOnline('project.ui.' + name, projectTypes.UI));
  }

  saveAll() {
    AppDispatcher.dispatch(projectSaveAllOnline());
  }

  saveOnline(project) {
    AppDispatcher.dispatch(projectSaveOnline(project));
  }

  saveAs(project) {
    AppDispatcher.dispatch(projectSaveAs(project));
  }

  render() {
    return (
      <MainToolbar
        activeProject={this.state.activeProject}
        onlineVPanelProjectList={this.state.onlineVPanelProjectList}
        onlineUiProjectList={this.state.onlineUiProjectList}
        onNewVPanelProject={this.newVPanelProject.bind(this)}
        onNewUiProject={this.newUiProject.bind(this)}
        onOpenFileVPanelProject={this.openFileVPanelProject.bind(this)}
        onOpenFileUiProject={this.openFileUiProject.bind(this)}
        onOpenOnlineVPanelProject={this.openOnlineVPanelProject.bind(this)}
        onOpenOnlineUiProject={this.openOnlineUiProject.bind(this)}
        onSaveAll={this.saveAll.bind(this)}
        onSaveOnline={this.saveOnline.bind(this)}
        onSaveAs={this.saveAs.bind(this)}
      />
    );
  }
}

export default MainToolbarContainer;
