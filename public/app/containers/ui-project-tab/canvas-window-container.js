'use strict';

import { connect } from 'react-redux';

import CanvasWindow from '../../components/ui-project-tab/canvas-window';

import { projectStateSelect, projectResizeWindow } from '../../actions/index';
import { getWindow, getImage, getWindowControls } from '../../selectors/ui-projects';
import { getProjectState } from '../../selectors/projects';

const mapStateToProps = (state, { project, window }) => {
  const projectState = getProjectState(state, { project });
  const windowObject = getWindow(state, { project, window });
  return {
    project,
    window     : windowObject,
    isSelected : !!(projectState && projectState.selection && projectState.selection.type === 'window' && projectState.selection.uid === window),
    background : getImage(state, { project, image: windowObject.backgroundResource }),
    controls   : getWindowControls(state, { project: project, window: window })
  };
};

const mapDispatchToProps = (dispatch, { project, window }) => ({
  onSelected : () => dispatch(projectStateSelect(project, { type: 'window', uid: window })),
  onResized  : (size) => dispatch(projectResizeWindow(project, window, size))
});

const CanvasWindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasWindow);

export default CanvasWindowContainer;