'use strict';

import React from 'react';

import MainToolbar from '../components/main-toolbar';

import OnlineStore from '../stores/online-store';
import ProjectStore from '../stores/project-store';
import ActiveTabStore from '../stores/active-tab-store';
import storeHandler from '../compat/store';

import {
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
    this.unsubscribe = storeHandler.getStore().subscribe(this.boundHandleStoreChange);
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
    ActiveTabStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ActiveTabStore.removeChangeListener(this.boundHandleStoreChange);
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
    this.unsubscribe();
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

  openFileVPanelProject(file) {
    projectLoadFile(file, 'vpanel');
  }

  openFileUiProject(file) {
    projectLoadFile(file, 'ui');
  }

  openOnlineVPanelProject(name) {
    projectLoadOnline('project.vpanel.' + name, 'vpanel');
  }

  openOnlineUiProject(name) {
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
