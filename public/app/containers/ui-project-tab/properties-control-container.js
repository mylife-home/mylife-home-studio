'use strict';

import { connect } from 'react-redux';

import PropertiesControl from '../../components/ui-project-tab/properties-control';

import { getWindowControl } from '../../selectors/ui-projects';
import { projectDeleteControl, projectControlChangeId, projectMoveControl, projectResizeControl } from '../../actions/index';

const mapStateToProps = (state, { project, window, control }) => ({
  project,
  window,
  control : getWindowControl(state, { project, window, control })
});

const mapDispatchToProps = (dispatch, { project, window, control }) => ({
  onDelete   : () => dispatch(projectDeleteControl(project, window, control.uid)),
  onChangeId : (value) => dispatch(projectControlChangeId(project, window, control.uid, value)),
  onMove     : (location) => dispatch(projectMoveControl(project, window, control.uid, location)),
  onResize   : (size) => dispatch(projectResizeControl(project, window, control.uid, size))
});

const PropertiesControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesControl);

export default PropertiesControlContainer;
