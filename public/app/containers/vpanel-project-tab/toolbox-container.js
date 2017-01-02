'use strict';

import { connect } from 'react-redux';

import Toolbox from '../../components/vpanel-project-tab/toolbox';
import { makeGetToolbox } from '../../selectors/vpanel-projects';

import {
  projectNewComponent,
  projectVPanelImportOnlineToolbox, projectVPanelImportOnlineDriverComponents,
  projectVPanelPrepareDeployVPanel, projectVPanelPrepareDeployDrivers
} from '../../actions/index';

const mapStateToProps = () => {
  const getToolbox = makeGetToolbox();
  return (state, props) => ({
    toolbox : getToolbox(state, props)
  });
};

const mapDispatchToProps = (dispatch, { project }) => ({
  onNewComponent                 : (location, plugin) => dispatch(projectNewComponent(project, location, plugin)),
  onImportOnlineToolbox          : () => dispatch(projectVPanelImportOnlineToolbox(project)),
  onImportOnlineDriverComponents : () => dispatch(projectVPanelImportOnlineDriverComponents(project)),
  onDeployVPanel                 : () => dispatch(projectVPanelPrepareDeployVPanel(project)),
  onDeployDrivers                : () => dispatch(projectVPanelPrepareDeployDrivers(project))
});

const ToolboxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbox);

export default ToolboxContainer;