'use strict';

import React from 'react';
import * as dnd from 'react-dnd';
import Measure from 'react-measure';
import { stopPropagationWrapper } from '../../utils/index';

import storeHandler from '../../compat/store';
import { dragTypes } from '../../constants/index';
import AppDispatcher from '../../compat/dispatcher';
import { projectStateSelect } from '../../actions/index';
import { getComponents, getBindings } from '../../selectors/vpanel-projects';
import { getProjectState } from '../../selectors/projects';

import CanvasManager from './canvas-manager';
import CanvasComponent from './canvas-component';
import CanvasBinding from './canvas-binding';

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

    this.boundHandleMeasureChange = this.handleMeasureChange.bind(this);

    this.canvasManager = new CanvasManager();
  }

  getChildContext() {
    return { canvasManager: this.canvasManager };
  }

  select() {
    const { project } = this.props;
    AppDispatcher.dispatch(projectStateSelect(project, null));
  }

  componentDidMount() {
    this.refs.scrollbox.addEventListener('scroll', this.boundHandleMeasureChange);
    this.handleMeasureChange();
  }

  componentWillUnmount() {
    this.refs.scrollbox.removeEventListener('scroll', this.boundHandleMeasureChange);
  }

  handleMeasureChange() {
    const node = this.refs.canvas;
    // may be not yet rendered
    if(!node) { return; }
    const dim = node.getBoundingClientRect();

    this.canvasManager.canvasMeasureChanged(dim);
  }

  renderComponents(project) {
    const components = getComponents(storeHandler.getStore().getState(), { project: project.uid }).toArray();
    return components.map(component => (<CanvasComponent key={component.uid} project={project} component={component}/>));
  }

  renderBindings(project) {
    const state        = storeHandler.getStore().getState();
    const bindings     = getBindings(state, { project: project.uid }).toArray();
    const projectState = getProjectState(state, { project: project.uid });
    return bindings.map(binding => (
      <CanvasBinding key={binding.uid}
                     project={project}
                     binding={binding}
                     isSelected={!!(projectState && projectState.selection && projectState.selection.type === 'binding' && projectState.selection.uid === binding.uid)}
                     onSelected={(binding) => AppDispatcher.dispatch(projectStateSelect(project, { type: 'binding', uid: binding.uid }))}
      />
    ));
  }

  render() {
    const { project, connectDropTarget, isHighlighted } = this.props;

    const canvasStyle = isHighlighted ?
      Object.assign({}, styles.canvas, styles.canvasHighlight) :
      Object.assign({}, styles.canvas);

    return connectDropTarget(
      <div style={styles.container}>
        <div style={styles.scrollbox} ref="scrollbox">
          <div style={canvasStyle} onClick={stopPropagationWrapper(this.select.bind(this))} ref="canvas">
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

Canvas.childContextTypes = {
  canvasManager: React.PropTypes.object.isRequired
};

const canvasTarget = {
  drop(props, monitor, component) {
    switch(monitor.getItemType()) {
      case dragTypes.VPANEL_PLUGIN: {
        const canvasRect = component.refs.canvas.getBoundingClientRect();
        const dropOffset = monitor.getClientOffset();
        const location = { x: dropOffset.x - canvasRect.left, y: dropOffset.y - canvasRect.top };
        // handled in ToolboxPlugin/endDrag
        return { location };
      }

      case dragTypes.VPANEL_COMPONENT:
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

export default dnd.DropTarget([dragTypes.VPANEL_PLUGIN, dragTypes.VPANEL_COMPONENT], canvasTarget, collect)(Canvas);