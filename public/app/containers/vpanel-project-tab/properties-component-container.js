'use strict';

import { connect } from 'react-redux';

import PropertiesComponent from '../../components/vpanel-project-tab/properties-component';

import { projectDeleteVPanelComponent, projectComponentChangeId, projectComponentChangeConfig } from '../../actions/index';
import { getComponent, getPlugin } from '../../selectors/vpanel-projects';

const mapStateToProps = (state, { project, component }) => {
  const componentObject = getComponent(state, { project, component });
  return {
    component : componentObject,
    plugin    : getPlugin(state, { project, plugin: componentObject.plugin })
  };
};

const mapDispatchToProps = (dispatch, { project, component }) => ({
  onDelete       : () => dispatch(projectDeleteVPanelComponent(project, component)),
  onChangeId     : (value) => dispatch(projectComponentChangeId(project, component, value)),
  onChangeConfig : (name, value) => dispatch(projectComponentChangeConfig(project, component, name, value))
});

const PropertiesComponentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesComponent);

export default PropertiesComponentContainer;
