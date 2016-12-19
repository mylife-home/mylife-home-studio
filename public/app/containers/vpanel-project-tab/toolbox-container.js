'use strict';

import { connect } from 'react-redux';

import Toolbox from '../../components/vpanel-project-tab/toolbox';
import { projectNewComponent } from '../../actions/index';
import { getProject } from '../../selectors/projects';
import { makeGetToolbox } from '../../selectors/vpanel-projects';

const mapStateToProps = () => {
  const getToolbox = makeGetToolbox();
  return (state, props) => ({
    project: getProject(state, props),
    toolbox : getToolbox(state, props)
  });
};

const mapDispatchToProps = (dispatch) => ({
  onNewComponent: (project, location, plugin) => dispatch(projectNewComponent(project, location, plugin))
});

const ToolboxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbox);

export default ToolboxContainer;