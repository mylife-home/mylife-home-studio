'use strict';

import { connect } from 'react-redux';

import CanvasComponent from '../../components/vpanel-project-tab/canvas-component';

import { getPlugin } from '../../selectors/vpanel-projects';
import { getProjectState } from '../../selectors/projects';
import { projectStateSelect, projectNewBinding, projectMoveComponent } from '../../actions/index';

const mapStateToProps = (state, { project, component }) => {
  const projectState = getProjectState(state, { project: project.uid });
  return {
    project,
    component,
    plugin     : getPlugin(state, { project: project.uid, plugin: component.plugin }),
    isSelected : !!(projectState && projectState.selection && projectState.selection.type === 'component' && projectState.selection.uid === component.uid)
  };
};

const mapDispatchToProps = (dispatch, { project, component }) => ({
  onSelected      : () => dispatch(projectStateSelect(project.uid, { type: 'component', uid: component.uid })),
  onComponentMove : (location) => dispatch(projectMoveComponent(project.uid, component.uid, location)),
  onCreateBinding : (remoteComponent, remoteAttribute, localComponent, localAction) => dispatch(projectNewBinding(project.uid, remoteComponent, remoteAttribute, localComponent, localAction))
});

const CanvasComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasComponent);

export default CanvasComponentContainer;