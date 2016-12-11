'use strict';

import React from 'react';
import * as dnd from 'react-dnd';
import icons from '../icons';

import AppConstants from '../../constants/app-constants';

import { projectNewBinding } from '../../actions/index';
import styles from './canvas-component-styles';

import linkHelper from './link-helper';

const CanvasComponentAttribute = ({ attribute, connectDragPreview, connectDragSource }) => connectDragSource(
  <div style={styles.detailsContainer}>
    {connectDragPreview(<div style={styles.detailsIconContainer}><icons.NetAttribute style={styles.detailsIcon} /></div>)}
    <div style={styles.detailsText}>{`${attribute.name} (${attribute.type})`}</div>
  </div>
);

CanvasComponentAttribute.propTypes = {
  project: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  attribute: React.PropTypes.object.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  connectDragPreview: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};

const attributeSource = {
  beginDrag(props/*, monitor*/) {
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

    projectNewBinding(project, component.id, attribute.name, componentId, actionName);
    linkHelper.rebuild(project);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

export default dnd.DragSource(AppConstants.DragTypes.VPANEL_COMPONENT_ATTRIBUTE, attributeSource, collect)(CanvasComponentAttribute);
