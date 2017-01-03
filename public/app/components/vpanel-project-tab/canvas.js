'use strict';

import React from 'react';
import * as dnd from 'react-dnd';
import Measure from 'react-measure';
import { stopPropagationWrapper } from '../../utils/index';
import { dragTypes } from '../../constants/index';

import CanvasManager from './canvas-manager';
import CanvasComponentContainer from '../../containers/vpanel-project-tab/canvas-component-container';
import CanvasBindingContainer from '../../containers/vpanel-project-tab/canvas-binding-container';

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

  render() {
    const { project, components, bindings, onSelected, connectDropTarget, isHighlighted } = this.props;

    const canvasStyle = isHighlighted ?
      Object.assign({}, styles.canvas, styles.canvasHighlight) :
      Object.assign({}, styles.canvas);

    return connectDropTarget(
      <div style={styles.container}>
        <div style={styles.scrollbox} ref="scrollbox">
          <div style={canvasStyle} onClick={stopPropagationWrapper(onSelected)} ref="canvas">
            <Measure onMeasure={this.handleMeasureChange.bind(this)}>
              <div>
                {components.map(component => (<CanvasComponentContainer key={component.uid} project={project} component={component} />))}
                {bindings.map(binding => (<CanvasBindingContainer key={binding.uid} project={project} binding={binding} />))}
              </div>
            </Measure>
          </div>
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {
  project           : React.PropTypes.object.isRequired,
  components        : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  bindings          : React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  onSelected        : React.PropTypes.func.isRequired,
  connectDropTarget : React.PropTypes.func.isRequired,
  isHighlighted     : React.PropTypes.bool.isRequired
};

Canvas.childContextTypes = {
  canvasManager : React.PropTypes.object.isRequired
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
    connectDropTarget : connect.dropTarget(),
    isHighlighted     : monitor.canDrop()
  };
}

export default dnd.DropTarget([dragTypes.VPANEL_PLUGIN, dragTypes.VPANEL_COMPONENT], canvasTarget, collect)(Canvas);