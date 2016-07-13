'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import Facade from '../../services/facade';
import AppConstants from '../../constants/app-constants';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

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
    super(props);

    const projectState = ProjectStateStore.getProjectState(this.props.project);

    this.state = {
      isSelected:      false,
      linkVersion: linkHelper.version(projectState),
      muiTheme:        context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  componentDidMount() {
    ProjectStateStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    ProjectStateStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
    const { project, binding } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);
    this.setState({
      isSelected:      projectState.selection &&
                       projectState.selection.type === 'binding' &&
                       projectState.selection.remoteId === binding.remote.id &&
                       projectState.selection.localId === binding.local.id &&
                       projectState.selection.remoteAttribute === binding.remote_attribute &&
                       projectState.selection.localAction === binding.local_action,
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
    const projectState = ProjectStateStore.getProjectState(project);
    projectState.selection = {
      type: 'binding',
      remoteId: binding.remote.id,
      localId: binding.local.id,
      remoteAttribute: binding.remote_attribute,
      localAction: binding.local_action
    };
    ProjectActionCreators.stateRefresh(project);
  }

  render() {
    const { project, binding } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);
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
             onClick={base.utils.stopPropagationWrapper(this.select.bind(this))}>
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