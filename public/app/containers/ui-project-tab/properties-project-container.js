'use strict';

import { connect } from 'react-redux';

import PropertiesProject from '../../components/ui-project-tab/properties-project';

import { getProject } from '../../selectors/projects';
import { projectChangeName, projectChangeDesktopDefaultWindow, projectChangeMobileDefaultWindow } from '../../actions/index';

const mapStateToProps = (state, { project }) => ({
  project : getProject(state, { project })
});

const mapDispatchToProps = (dispatch, { project }) => ({
  onNameChange          : (value) => dispatch(projectChangeName(project, value)),
  onDesktopWindowChange : (window) => dispatch(projectChangeDesktopDefaultWindow(project, window)),
  onMobileWindowChange  : (window) => dispatch(projectChangeMobileDefaultWindow(project, window))
});

const PropertiesProjectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesProject);

export default PropertiesProjectContainer;
