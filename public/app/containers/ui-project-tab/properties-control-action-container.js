'use strict';

import { connect } from 'react-redux';

import PropertiesControlAction from '../../components/ui-project-tab/properties-control-action';
import {
  makeGetSortedWindows, makeGetSortedComponents,
  getWindowControl, getWindow, getComponent
} from '../../selectors/ui-projects';

import { projectControlChangeAction } from '../../actions/index';


const mapStateToProps = () => {
  const getSortedWindows = makeGetSortedWindows();
  const getSortedComponents = makeGetSortedComponents();
  return (state, props) => {

    const action = getWindowControl(state, props)[props.action];

    return {
      sortedWindows     : getSortedWindows(state, props),
      sortedComponents  : getSortedComponents(state, props),
      action,
      selectedComponent : action && action.component && getComponent(state, { ...props, component: action.component.component }),
      selectedWindow    : action && action.window && getWindow(state, { ...props, window: action.window.window })
    };
  };
};

const mapDispatchToProps = (dispatch, { project, window, control, action }) => ({
  onActionChange: (newAction) => dispatch(projectControlChangeAction(project, window, control, action, newAction))
});

const PropertiesControlActionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesControlAction);

export default PropertiesControlActionContainer;