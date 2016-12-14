'use strict';

import { connect } from 'react-redux';

import ToolboxControl from '../../components/ui-project-tab/toolbox-control';
import { projectNewControl } from '../../actions/index';

const mapDispatchToProps = (dispatch) => ({
  onNewControl: (project, location, type) => dispatch(projectNewControl(project, location, type))
});

const ToolboxControlContainer = connect(
  null,
  mapDispatchToProps
)(ToolboxControl);

export default ToolboxControlContainer;