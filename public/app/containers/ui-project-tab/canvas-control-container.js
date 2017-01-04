'use strict';

import { connect } from 'react-redux';

import CanvasControl from '../../components/ui-project-tab/canvas-control';

import { getProjectState } from '../../selectors/projects';
import { getImage } from '../../selectors/ui-projects';
import { projectStateSelect, projectResizeControl, projectMoveControl } from '../../actions/index';

const mapStateToProps = (state, { project, window, control }) => {
  const projectState = getProjectState(state, { project });
  return {
    project,
    window,
    control,
    isSelected   : projectState && projectState.selection && projectState.selection.type === 'control' && projectState.selection.controlUid === control.uid,
    displayImage : control.display && getImage(state, { project, image: control.display.defaultResource })
  };
};

const mapDispatchToProps = (dispatch, { project, window, control }) => ({
  onSelected : () => dispatch(projectStateSelect(project, { type: 'control', windowUid: window.uid, controlUid: control.uid })),
  onResized  : (size) => dispatch(projectResizeControl(project, window.uid, control.uid, size)),
  onMove     : (location) => dispatch(projectMoveControl(project, window.uid, control.uid, location))
});

const CanvasControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasControl);

export default CanvasControlContainer;
