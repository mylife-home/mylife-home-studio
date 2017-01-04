'use strict';

import { connect } from 'react-redux';

import PropertiesControl from '../../components/ui-project-tab/properties-control';

import { getProject } from '../../selectors/projects';
import { getWindow, getWindowControl } from '../../selectors/ui-projects';
//import { projectDeleteControl, projectControlChangeId, projectResizeControl, projectControlChangeImage } from '../../actions/index';

const mapStateToProps = (state, { project, window, control }) => ({
  project : getProject(state, { project }),
  window  : getWindow(state, { project, window }),
  control : getWindowControl(state, { project, window, control })
});

const mapDispatchToProps = (dispatch, { project, window, control }) => ({
  //onDelete      : () => dispatch(projectDeleteControl(project, window)),
});

const PropertiesControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesControl);

export default PropertiesControlContainer;
