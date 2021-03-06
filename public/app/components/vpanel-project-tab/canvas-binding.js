'use strict';

import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import icons from '../icons';
import { stopPropagationWrapper } from '../../utils/index';

function getStyles(props) {
  const { isSelected, muiTheme } = props;

  return {
    container: {
      position : 'absolute',
      top      : 0,
      left     : 0,
      height   : '32000px',
      width    : '32000px'
    },
    box: {
      zIndex     : 2,
      position   : 'absolute',
      height     : '16px',
      width      : '16px',
      background : (isSelected ? muiTheme.palette.primary1Color : muiTheme.palette.primary3Color),
    },
    boxIcon: {
      margin        : '2px',
      width         : '12px',
      height        : '12px',
      color         : (isSelected ? muiTheme.palette.alternateTextColor : muiTheme.palette.textColor),
    },
    svg: {
      position : 'absolute',
      top      : 0,
      left     : 0,
      height   : '32000px',
      width    : '32000px'
    },
    path: {
      stroke      : (isSelected ? muiTheme.palette.primary1Color : muiTheme.palette.primary3Color),
      strokeWidth : 2
    }
  };
}

class CanvasBinding extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      path: this.context.canvasManager.bindingPath(props.binding)
    };

    this.boundHandleMeasureChange = this.handleMeasureChange.bind(this);
  }

  componentDidMount() {
    this.canvasManagerUnsubscribe = this.context.canvasManager.addBindingChangedListener(this.boundHandleMeasureChange);
  }

  componentWillUnmount() {
    this.canvasManagerUnsubscribe();
  }

  handleMeasureChange() {
    const { binding } = this.props;
    this.setState({
      path: this.context.canvasManager.bindingPath(binding)
    });
  }

  render() {
    const { path } = this.state;
    const { onSelected, binding } = this.props;

    if(!path) {
      return null;
    }

    const styles = getStyles(this.props);
    const start  = path[0];
    const end    = path[path.length-1];
    const middle = path[Math.round(path.length / 2) - 1];

    return (
      <div style={styles.container}>
        <svg style={styles.svg}>
          <g>
            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} style={styles.path} />
          </g>
        </svg>
        <div style={Object.assign({left: `${middle.x - 8}px`, top: `${middle.y - 8}px`}, styles.box)}
             onClick={stopPropagationWrapper(() => onSelected(binding))}>
          <icons.Binding color={styles.boxIcon.color} style={styles.boxIcon} />
        </div>
      </div>
    );
  }
}

CanvasBinding.propTypes = {
  project    : React.PropTypes.object.isRequired,
  binding    : React.PropTypes.object.isRequired,
  isSelected : React.PropTypes.bool.isRequired,
  onSelected : React.PropTypes.func.isRequired
};

CanvasBinding.contextTypes = {
  canvasManager : React.PropTypes.object.isRequired
};

export default muiThemeable()(CanvasBinding);