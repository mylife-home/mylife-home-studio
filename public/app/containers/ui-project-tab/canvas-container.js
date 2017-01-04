'use strict';

import { connect } from 'react-redux';

import Canvas from '../../components/ui-project-tab/canvas';

import { getProjectState } from '../../selectors/projects';

const mapStateToProps = (state, { project }) => {
  const projectState  = getProjectState(state, { project });
  return {
    project,
    activeContent : projectState && projectState.activeContent
  };
};

const CanvasContainer = connect(
  mapStateToProps,
  null
)(Canvas);

export default CanvasContainer;
