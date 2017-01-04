'use strict';

import { connect } from 'react-redux';

import PropertiesComponent from '../../components/ui-project-tab/properties-component';

import { getComponent } from '../../selectors/ui-projects';
import { projectDeleteUiComponent } from '../../actions/index';

const mapStateToProps = (state, { project, component }) => ({
  component : getComponent(state, { project, component })
});

const mapDispatchToProps = (dispatch, { project, component }) => ({
  onDelete : () => dispatch(projectDeleteUiComponent(project, component))
});

const PropertiesComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesComponent);

export default PropertiesComponentContainer;
