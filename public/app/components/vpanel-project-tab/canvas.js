'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import joint from 'jointjs';
import base from '../base/index';

import AppConstants from '../../constants/app-constants';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

import CanvasCompoment from './canvas-component';

import tabStyles from '../base/tab-styles';

const styles = {
  container: {
    position : 'relative',
    height   : 'calc(100% - 80px)',
    overflow : 'scroll'
  },
  canvas: {
    position : 'absolute',
    top      : 0,
    left     : 0,
    height   : '10000px',
    width    : '10000px'
  },
  canvasHighlight: {
    backgroundColor: 'lightgray'
  }
};

class Canvas extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: ReactDOM.findDOMNode(this.refs.canvas),
      width: 10000,
      height: 10000,
      model: this.graph,
      gridSize: 1
    });
  }

  componentWillUnmount() {
    this.paper = null;
    this.graph = null;
  }

  select() {
    const project = this.props.project;
    const state = ProjectStateStore.getProjectState(project);
    state.selection = null;
    ProjectActionCreators.stateRefresh(project);
  }

  render() {
    const { project, connectDropTarget, isHighlighted } = this.props;

    const canvasStyle = isHighlighted ?
      Object.assign({}, styles.canvas, styles.canvasHighlight) :
      Object.assign({}, styles.canvas);

    return connectDropTarget(
      <div style={styles.container}>
        <div style={canvasStyle} onClick={base.utils.stopPropagationWrapper(this.select.bind(this))} ref="canvas">
          {project.components.map((component) => (<CanvasCompoment key={component.id} project={project} component={component}/>))}
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  project: React.PropTypes.object.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
  isHighlighted: React.PropTypes.bool.isRequired
};

const canvasTarget = {
  drop(props, monitor, component) {
    switch(monitor.getItemType()) {
    case AppConstants.DragTypes.VPANEL_PLUGIN:
      const canvasRect = component.refs.canvas.getBoundingClientRect();
      const dropOffset = monitor.getClientOffset();
      const location = { x: dropOffset.x - canvasRect.left, y: dropOffset.y - canvasRect.top };
      // handled in ToolboxPlugin/endDrag
      return { location };

    case AppConstants.DragTypes.VPANEL_COMPONENT:
      // handled in CanvasComponent/endDrag
      return { delta: monitor.getDifferenceFromInitialOffset() };
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isHighlighted: monitor.canDrop()
  };
}

export default dnd.DropTarget([AppConstants.DragTypes.VPANEL_PLUGIN, AppConstants.DragTypes.VPANEL_COMPONENT], canvasTarget, collect)(Canvas);