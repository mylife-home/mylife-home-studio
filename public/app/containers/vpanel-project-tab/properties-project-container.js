'use strict';

import { connect } from 'react-redux';

import PropertiesProject from '../../components/vpanel-project-tab/properties-project';

import { projectChangeName } from '../../actions/index';
import { getProject } from '../../selectors/projects';

const mapStateToProps = (state, { project }) => ({
  project : getProject(state, { project })
});

const mapDispatchToProps = (dispatch, { project }) => ({
  onChangeName : (value) => dispatch(projectChangeName(project, value))
});

const PropertiesProjectContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesProject);

export default PropertiesProjectContainer;
