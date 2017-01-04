'use strict';

import { connect } from 'react-redux';

import PropertiesImage from '../../components/ui-project-tab/properties-image';

import { getImage } from '../../selectors/ui-projects';
import { projectImageChangeId, projectImageChangeFile, projectDeleteImage } from '../../actions/index';

const mapStateToProps = (state, { project, image }) => ({
  image : getImage(state, { project, image })
});

const mapDispatchToProps = (dispatch, { project, image }) => ({
  onChangeId   : (value) => dispatch(projectImageChangeId(project, image, value)),
  onChangeFile : (file) => dispatch(projectImageChangeFile(project, image, file)),
  onDelete     : () => dispatch(projectDeleteImage(project, image))
});

const PropertiesImageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesImage);

export default PropertiesImageContainer;

