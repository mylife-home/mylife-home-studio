'use strict';

import { connect } from 'react-redux';

import CanvasComponent from '../../components/ui-project-tab/canvas-component';

import { getComponent } from '../../selectors/ui-projects';

const mapStateToProps = (state, { project, component }) => {
  return {
    component : getComponent(state, { project, component })
  };
};

const CanvasComponentContainer = connect(
  mapStateToProps,
  null
)(CanvasComponent);

export default CanvasComponentContainer;