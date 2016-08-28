'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import base from '../base/index';

import Facade from '../../services/facade';
import AppConstants from '../../constants/app-constants';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';
import styles from './canvas-component-styles';

import linkHelper from './link-helper';

class CanvasComponentAttribute extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { project, component, attribute, connectDragPreview, connectDragSource, isDragging } = this.props;

    return connectDragSource(
      <div style={styles.detailsContainer}>
        {connectDragPreview(<div style={styles.detailsIconContainer}><base.icons.NetAttribute style={styles.detailsIcon} /></div>)}
        <div style={styles.detailsText}>{`${attribute.name} (${attribute.type})`}</div>
      </div>
    );
  }
}

CanvasComponentAttribute.propTypes = {
  project: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  attribute: React.PropTypes.object.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  connectDragPreview: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};

const attributeSource = {
  beginDrag(props, monitor) {
    const { component, attribute } = props;
    return {
      componentId: component.id,
      attributeName: attribute.name
    };
  },

  endDrag(props, monitor) {
    if(!monitor.didDrop()) { return; }

    const { project, component, attribute } = props;
    const { componentId, actionName } = monitor.getDropResult();

    const binding = Facade.projects.vpanelCreateBinding(project, component.id, attribute.name, componentId, actionName);

    const projectState = ProjectStateStore.getProjectState(project);
    projectState.selection = {
      type: 'binding',
      uid: binding.uid
    };
    ProjectActionCreators.stateRefresh(project);
    linkHelper.rebuild(project, projectState);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

export default dnd.DragSource(AppConstants.DragTypes.VPANEL_COMPONENT_ATTRIBUTE, attributeSource, collect)(CanvasComponentAttribute);
