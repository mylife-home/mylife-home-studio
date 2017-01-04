'use strict';

import { connect } from 'react-redux';

import Properties from '../../components/ui-project-tab/properties';

import { getProjectState } from '../../selectors/projects';

const mapStateToProps = (state, { project }) => {
  const projectState = getProjectState(state, { project: project });
  return {
    project,
    selection : projectState && projectState.selection
  };
};

const PropertiesContainer = connect(
  mapStateToProps,
  null
)(Properties);

export default PropertiesContainer;
