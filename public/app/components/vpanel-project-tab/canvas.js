'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import base from '../base/index';

import AppConstants from '../../constants/app-constants';

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

  render() {
    const { project, connectDropTarget, isHighlighted } = this.props;

    const canvasStyle = isHighlighted ?
      Object.assign({}, styles.canvas, styles.canvasHighlight) :
      Object.assign({}, styles.canvas);

    return connectDropTarget(
      <div style={styles.container}>
        <div style={canvasStyle}>
          {project.components.map((component) => (<CanvasCompoment key={component.id} component={component} />))}
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
  drop(props, monitor) {
    // TODO
    console.log('TODO DROP', monitor.getItemType(), props, monitor.getClientOffset(), monitor.getSourceClientOffset());
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isHighlighted: monitor.canDrop()
  };
}

export default dnd.DropTarget([AppConstants.DragTypes.VPANEL_PLUGIN, AppConstants.DragTypes.VPANEL_COMPONENT], canvasTarget, collect)(Canvas);