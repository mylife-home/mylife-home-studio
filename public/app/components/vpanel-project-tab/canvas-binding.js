'use strict';

import React from 'react';
import * as muiStyles from 'material-ui/styles/index';
import icons from '../icons';
import { stopPropagationWrapper } from '../../utils/index';

import AppDispatcher from '../../compat/dispatcher';
import { projectStateSelect } from '../../actions/index';
import storeHandler from '../../compat/store';
import { getProjectState } from '../../selectors/projects';

import linkHelper from './link-helper';

function getStyles(props, state) {
  const { muiTheme, isSelected } = state;
  const { baseTheme } = muiTheme;

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
      background : (isSelected ? baseTheme.palette.primary1Color : baseTheme.palette.primary3Color),
    },
    boxIcon: {
      margin        : '2px',
      width         : '12px',
      height        : '12px',
      color         : (isSelected ? baseTheme.palette.alternateTextColor : baseTheme.palette.textColor),
    },
    svg: {
      position : 'absolute',
      top      : 0,
      left     : 0,
      height   : '32000px',
      width    : '32000px'
    },
    path: {
      stroke      : (isSelected ? baseTheme.palette.primary1Color : baseTheme.palette.primary3Color),
      strokeWidth : 2
    }
  };
}

class CanvasBinding extends React.Component {

  constructor(props, context) {
    super(props, context);

    const projectState = getProjectState(storeHandler.getStore().getState(), { project });

    this.state = {
      isSelected:      false,
      linkVersion: linkHelper.version(projectState),
      muiTheme:        context.muiTheme || muiStyles.getMuiTheme()
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = storeHandler.getStore().subscribe(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleStoreChange() {
    const { project, binding } = this.props;
    const projectState = getProjectState(storeHandler.getStore().getState(), { project });
    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'binding' && projectState.selection.uid === binding.uid,
      linkVersion: linkHelper.version(projectState)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.isSelected !== this.state.isSelected) { return true; }
    if(nextState.linkVersion !== this.state.linkVersion) { return true; }
    return false;
  }

  select() {
    const { project, binding } = this.props;
    AppDispatcher.dispatch(projectStateSelect(project, { type: 'binding', uid: binding.uid }));
  }

  render() {
    const { project, binding } = this.props;
    const projectState = getProjectState(storeHandler.getStore().getState(), { project });
    const path = linkHelper.bindingPath(projectState, binding);
    const styles = getStyles(this.props, this.state);

    if(!path) {
      return null;
    }

    const start = path[0];
    const end = path[path.length-1];
    const middle = path[Math.round(path.length / 2) - 1];

    return (
      <div style={styles.container}>
        <svg style={styles.svg}>
          <g>
            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} style={styles.path} />
          </g>
        </svg>
        <div style={Object.assign({left: `${middle.x - 8}px`, top: `${middle.y - 8}px`}, styles.box)}
             onClick={stopPropagationWrapper(this.select.bind(this))}>
          <icons.Binding color={styles.boxIcon.color} style={styles.boxIcon} />
        </div>
      </div>
    );
  }
}

CanvasBinding.propTypes = {
  project: React.PropTypes.object.isRequired,
  binding: React.PropTypes.object.isRequired
};

CanvasBinding.contextTypes = {
  muiTheme: React.PropTypes.object
};

CanvasBinding.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default CanvasBinding;