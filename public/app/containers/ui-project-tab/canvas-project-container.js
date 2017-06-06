'use strict';

import { connect } from 'react-redux';

import CanvasProject from '../../components/ui-project-tab/canvas-project';

import { getProject } from '../../selectors/projects';

const mapStateToProps = (state, { project }) => {
  return {
    project : getProject(state, { project })
  };
};

const CanvasProjectContainer = connect(
  mapStateToProps,
  null
)(CanvasProject);

export default CanvasProjectContainer;