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

const styles = {
  icon: {
    textAlign     : 'center',
    height        : '12px',
    lineHeight    : '12px',
    verticalAlign : 'middle'
  }
};

class CanvasComponentAttribute extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ProjectStateStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    ProjectStateStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
  }

  render() {
    const { project, component, attribute, connectDragPreview, connectDragSource, isDragging } = this.props;

    return connectDragSource(
      <div>
        {connectDragPreview(<div><base.icons.NetAttribute style={styles.icon} /></div>)}
        {`${attribute.name} (${attribute.type})`}
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

    console.log('TODO endDrag');
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