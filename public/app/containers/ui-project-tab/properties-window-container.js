'use strict';

import { connect } from 'react-redux';

import PropertiesWindow from '../../components/ui-project-tab/properties-window';

import { getWindow } from '../../selectors/ui-projects';
import { projectDeleteWindow, projectWindowChangeId, projectResizeWindow, projectWindowChangeImage } from '../../actions/index';

const mapStateToProps = (state, { project, window }) => ({
  project,
  window : getWindow(state, { project, window })
});

const mapDispatchToProps = (dispatch, { project, window }) => ({
  onDelete      : () => dispatch(projectDeleteWindow(project, window)),
  onChangeId    : (value) => dispatch(projectWindowChangeId(project, window, value)),
  onResize      : (size) => dispatch(projectResizeWindow(project, window, size)),
  onChangeImage : (img) => dispatch(projectWindowChangeImage(project, window, img))
});

const PropertiesWindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesWindow);

export default PropertiesWindowContainer;
