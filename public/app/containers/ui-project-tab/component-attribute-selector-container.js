'use strict';

import { connect } from 'react-redux';

import ComponentAttributeSelector from '../../components/ui-project-tab/component-attribute-selector';
import { makeGetSortedComponents, getComponent } from '../../selectors/ui-projects';

const mapStateToProps = () => {
  const getSortedComponents = makeGetSortedComponents();
  return (state, props) => ({
    sortedComponents  : getSortedComponents(state, props),
    selectedComponent : getComponent(state, props)
  });
};

const ComponentAttributeSelectorContainer = connect(
  mapStateToProps,
  null
)(ComponentAttributeSelector);

export default ComponentAttributeSelectorContainer;