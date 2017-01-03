'use strict';

import { connect } from 'react-redux';

import CanvasBinding from '../../components/vpanel-project-tab/canvas-binding';

import { getProjectState } from '../../selectors/projects';
import { projectStateSelect } from '../../actions/index';

const mapStateToProps = (state, { project, binding }) => {
  const projectState = getProjectState(state, { project: project.uid });
  return {
    project,
    binding,
    isSelected : !!(projectState && projectState.selection && projectState.selection.type === 'binding' && projectState.selection.uid === binding.uid)
  };
};

const mapDispatchToProps = (dispatch, { project, binding }) => ({
  onSelected : () => dispatch(projectStateSelect(project.uid, { type: 'binding', uid: binding.uid }))
});

const CanvasBindingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasBinding);

export default CanvasBindingContainer;