'use strict';

import { connect } from 'react-redux';

import CanvasImage from '../../components/ui-project-tab/canvas-image';

import { getImage } from '../../selectors/ui-projects';

const mapStateToProps = (state, { project, image }) => ({
  image : getImage(state, { project, image })
});

const CanvasImageContainer = connect(
  mapStateToProps,
  null
)(CanvasImage);

export default CanvasImageContainer;