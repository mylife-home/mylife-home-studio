'use strict';

import { connect } from 'react-redux';

import MainToolbar from '../components/main-toolbar';

import { projectTypes } from '../constants/index';
import { getVPanelProjectNames, getUiProjectNames } from'../selectors/online';
import { getProject } from'../selectors/projects';

import {
  projectNew, projectLoadFile, projectLoadOnline, projectSaveOnline, projectSaveAs, projectSaveAllOnline
} from '../actions/index';

const mapStateToProps = (state) => {
  const activeTabId = state.activeTab;
  const activeProjectId = activeTabId.startsWith('project-') && parseInt(activeTabId.substring('project-'.length));
  const activeProject = activeProjectId ? getProject(state, { project: activeProjectId }) : null;

  return {
    activeProject,
    onlineVPanelProjectList : getVPanelProjectNames(state),
    onlineUiProjectList     : getUiProjectNames(state)
  };
};

const mapDispatchToProps = ({
  onNewVPanelProject        : () => projectNew(projectTypes.VPANEL),
  onNewUiProject            : () => projectNew(projectTypes.UI),
  onOpenFileVPanelProject   : (file) => projectLoadFile(file, projectTypes.VPANEL),
  onOpenFileUiProject       : (file) => projectLoadFile(file, projectTypes.UI),
  onOpenOnlineVPanelProject : (name) => projectLoadOnline('project.vpanel.' + name, projectTypes.VPANEL),
  onOpenOnlineUiProject     : (name) => projectLoadOnline('project.ui.' + name, projectTypes.UI),
  onSaveAll                 : projectSaveAllOnline,
  onSaveOnline              : projectSaveOnline,
  onSaveAs                  : projectSaveAs
});

const MainToolbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainToolbar);

export default MainToolbarContainer;
