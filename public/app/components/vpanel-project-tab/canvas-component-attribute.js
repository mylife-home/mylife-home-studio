'use strict';

import React from 'react';
import * as dnd from 'react-dnd';
import icons from '../icons';

import { dragTypes } from '../../constants/index';

import AppDispatcher from '../../compat/dispatcher';
import { projectNewBinding } from '../../actions/index';
import styles from './canvas-component-styles';

const CanvasComponentAttribute = ({ attribute, connectDragPreview, connectDragSource }) => connectDragSource(
  <div style={styles.detailsContainer}>
    {connectDragPreview(<div style={styles.detailsIconContainer}><icons.NetAttribute style={styles.detailsIcon} /></div>)}
    <div style={styles.detailsText}>{`${attribute.name} (${attribute.type})`}</div>
  </div>
);

CanvasComponentAttribute.propTypes = {
  project            : React.PropTypes.object.isRequired,
  component          : React.PropTypes.object.isRequired,
  attribute          : React.PropTypes.object.isRequired,
  connectDragSource  : React.PropTypes.func.isRequired,
  connectDragPreview : React.PropTypes.func.isRequired,
  isDragging         : React.PropTypes.bool.isRequired
};

const attributeSource = {
  beginDrag(props/*, monitor*/) {
    const { component, attribute } = props;
    return {
      remoteComponent : component.uid,
      remoteAttribute : attribute.name
    };
  },

  endDrag(props, monitor) {
    if(!monitor.didDrop()) { return; }

    const { project, component, attribute } = props;
    const { localComponent, localAction } = monitor.getDropResult();

    AppDispatcher.dispatch(projectNewBinding(project, component.uid, attribute.name, localComponent, localAction));
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource  : connect.dragSource(),
    connectDragPreview : connect.dragPreview(),
    isDragging         : monitor.isDragging()
  };
}

export default dnd.DragSource(dragTypes.VPANEL_COMPONENT_ATTRIBUTE, attributeSource, collect)(CanvasComponentAttribute);
