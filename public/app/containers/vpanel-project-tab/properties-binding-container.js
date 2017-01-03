'use strict';

import { connect } from 'react-redux';

import PropertiesBinding from '../../components/vpanel-project-tab/properties-binding';

import { projectDeleteBinding } from '../../actions/index';
import { getComponent, getBinding } from '../../selectors/vpanel-projects';

const mapStateToProps = (state, { project, binding }) => {
  const bindingObject = getBinding(state, { project, binding });
  return {
    binding: bindingObject,
    remote : getComponent(state, { project, component: bindingObject.remote }),
    local  : getComponent(state, { project, component: bindingObject.local  })
  };
};

const mapDispatchToProps = (dispatch, { project, binding }) => ({
  onDelete : () => dispatch(projectDeleteBinding(project, binding))
});

const PropertiesBindingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesBinding);

export default PropertiesBindingContainer;
