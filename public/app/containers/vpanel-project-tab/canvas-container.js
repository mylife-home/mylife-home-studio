'use strict';

import { connect } from 'react-redux';

import Canvas from '../../components/vpanel-project-tab/canvas';

import { getComponents, getBindings } from '../../selectors/vpanel-projects';
import { projectStateSelect } from '../../actions/index';

const mapStateToProps = (state, { project }) => ({
  project,
  components : getComponents(state, { project: project.uid }).toArray(),
  bindings   : getBindings(state, { project: project.uid }).toArray()
});

const mapDispatchToProps = (dispatch, { project }) => ({
  onSelected : () => dispatch(projectStateSelect(project.uid, null))
});

const CanvasContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);

export default CanvasContainer;