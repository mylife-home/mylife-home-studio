'use strict';

import React from 'react';
import * as dnd from 'react-dnd';
import icons from '../icons';

import Facade from '../../services/facade';
import { dragTypes } from '../../constants/index';
import commonStyles from './canvas-component-styles';

const styles = Object.assign({
  highlight: {
    backgroundColor: 'lightgray'
  }
}, commonStyles);

const CanvasComponentAction = ({ action, connectDropTarget, isHighlighted }) => {

  const containerStyle = isHighlighted ?
    Object.assign({}, styles.detailsContainer, styles.highlight) :
    Object.assign({}, styles.detailsContainer);

  return connectDropTarget(
    <div style={containerStyle}>
      <div style={styles.detailsIconContainer}><icons.NetAction style={styles.detailsIcon} /></div>
      <div style={styles.detailsText}>{`${action.name} (${action.types})`}</div>
    </div>
  );
};

CanvasComponentAction.propTypes = {
  project           : React.PropTypes.object.isRequired,
  component         : React.PropTypes.object.isRequired,
  action            : React.PropTypes.object.isRequired,
  connectDropTarget : React.PropTypes.func.isRequired,
  isHighlighted     : React.PropTypes.bool.isRequired
};

const actionTarget = {
  drop(props) {
    const { component, action } = props;
    return {
      localComponent : component.uid,
      localAction    : action.name
    };
  },

  canDrop(props, monitor) {
    const { project, component, action } = props;
    const { remoteComponent, remoteAttribute } = monitor.getItem();

    return Facade.projects.vpanelCanCreateBinding(project, remoteComponent, remoteAttribute, component.uid, action.name);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget : connect.dropTarget(),
    isHighlighted     : monitor.canDrop()
  };
}

export default dnd.DropTarget(dragTypes.VPANEL_COMPONENT_ATTRIBUTE, actionTarget, collect)(CanvasComponentAction);