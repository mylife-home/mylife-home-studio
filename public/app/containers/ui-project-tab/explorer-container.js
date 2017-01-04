'use strict';

import { connect } from 'react-redux';

import Explorer from '../../components/ui-project-tab/explorer';

import {makeGetSortedComponents, makeGetSortedImages, makeGetSortedWindows } from '../../selectors/ui-projects';
import { getVPanelProjectNames } from'../../selectors/online';
import {
  projectStateSelectAndActiveContent,
  projectNewImage, projectNewWindow,
  projectUiImportOnline, projectUiImportVPanelProjectFile, projectUiImportVPanelProjectOnline, projectUiPrepareDeploy
} from '../../actions/index';

const mapStateToProps = () => {
  const getSortedComponents = makeGetSortedComponents();
  const getSortedImages     = makeGetSortedImages();
  const getSortedWindows    = makeGetSortedWindows();
  return (state, props) => ({
    sortedComponents   : getSortedComponents(state, props),
    sortedImages       : getSortedImages(state, props),
    sortedWindows      : getSortedWindows(state, props),
    vpanelProjectNames : getVPanelProjectNames(state)
  });
};

const mapDispatchToProps = (dispatch, { project }) => ({
  onSelect                  : (data) => dispatch(projectStateSelectAndActiveContent(project, data, data)),
  onNewImage                : () => dispatch(projectNewImage(project)),
  onNewWindow               : () => dispatch(projectNewWindow(project)),
  onImportOnline            : () => dispatch(projectUiImportOnline(project)),
  onOpenFileVPanelProject   : (file) => dispatch(projectUiImportVPanelProjectFile(project, file)),
  onOpenOnlineVPanelProject : (name) => dispatch(projectUiImportVPanelProjectOnline(project, name)),
  onDeploy                  : () => dispatch(projectUiPrepareDeploy(project))
});

const ExplorerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Explorer);

export default ExplorerContainer;
