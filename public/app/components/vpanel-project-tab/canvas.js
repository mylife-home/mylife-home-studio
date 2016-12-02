'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import Measure from 'react-measure';
import base from '../base/index';

import AppConstants from '../../constants/app-constants';
import ProjectStore from '../../stores/project-store';
import ProjectActionCreators from '../../actions/project-action-creators';

import CanvasComponent from './canvas-component';
import CanvasBinding from './canvas-binding';

import linkHelper from './link-helper';

import tabStyles from '../base/tab-styles';

const styles = {
  container: {
    position : 'relative',
    height   : 'calc(100% - 80px)'
  },
  scrollbox: {
    position : 'relative',
    height   : '100%',
    overflow : 'scroll'
  },
  canvas: {
    position : 'absolute',
    top      : 0,
    left     : 0,
    height   : '32000px',
    width    : '32000px'
  },
  canvasHighlight: {
    backgroundColor: 'lightgray'
  }
};

class Canvas extends React.Component {

  constructor(props) {
    super(props);

    this.state = { };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
    this.boundHandleMeasureChange = this.handleMeasureChange.bind(this);
  }

  select() {
    const project = this.props.project;
    const state = ProjectStore.getProjectState(project);
    state.selection = null;
    ProjectActionCreators.stateRefresh(project);
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
    this.refs.scrollbox.addEventListener('scroll', this.boundHandleMeasureChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
    this.refs.scrollbox.removeEventListener('scroll', this.boundHandleMeasureChange);
  }

  handleStoreChange() {
    const project = this.props.project;
    let projectVersion = project && project.version;
    this.setState({ projectVersion });
  }

  handleMeasureChange() {
    const { project } = this.props;
    const projectState = ProjectStore.getProjectState(project);

    const node = this.refs.canvas;
    // may be not yet rendered
    if(!node) { return; }
    const dim = node.getBoundingClientRect();

    linkHelper.canvasOnMeasureChanged(project, projectState, dim);
  }

  renderComponents(project) {
    return project.components.map(component => (<CanvasComponent key={component.uid} project={project} component={component}/>));
  }

  renderBindings(project) {
    return project.bindings.map(binding => (<CanvasBinding key={binding.uid} project={project} binding={binding}/>));
  }

  render() {
    const { project, connectDropTarget, isHighlighted } = this.props;

    const canvasStyle = isHighlighted ?
      Object.assign({}, styles.canvas, styles.canvasHighlight) :
      Object.assign({}, styles.canvas);

    return connectDropTarget(
      <div style={styles.container}>
        <div style={styles.scrollbox} ref="scrollbox">
          <div style={canvasStyle} onClick={base.utils.stopPropagationWrapper(this.select.bind(this))} ref="canvas">
            <Measure onMeasure={this.handleMeasureChange.bind(this)}>
              <div>
                {this.renderComponents(project)}
                {this.renderBindings(project)}
              </div>
            </Measure>
          </div>
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