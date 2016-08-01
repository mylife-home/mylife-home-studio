'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import ResizableBox from 'react-resizable-box';
import { throttle, debounce } from 'throttle-debounce';
import base from '../base/index';

import Facade from '../../services/facade';
import AppConstants from '../../constants/app-constants';
import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

function getStyles(props, state) {
  const { window, control } = props;
  const { muiTheme, isSelected } = state;
  const { baseTheme } = muiTheme;

  const backColor = (isSelected ? baseTheme.palette.primary1Color : baseTheme.palette.primary3Color);
  const foreColor = (isSelected ? baseTheme.palette.alternateTextColor : baseTheme.palette.textColor);
  const left = (window.width * control.x) - (control.width / 2);
  const top = (window.height * control.y) - (control.height / 2);

  return Object.assign({
    controlContainer: {
      position : 'absolute',
      left,
      top
    },
    control: {
      height: '100%',
      border: '1px solid ' + backColor,
      position: 'relative'
    },
    moveHandle: {
      backgroundColor: backColor,
      position: 'absolute',
      width: '15px',
      height: '15px',
      display: 'inline-block',
      top: '10px',
      left: '10px',
      cursor: 'move'
    }
  });
}

class CanvasControl extends React.Component {

  constructor(props, context) {
    super(props, context);

    const { project, control } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);

    this.state = {
      isSelected: projectState.selection && projectState.selection.type === 'control' && projectState.selection.controlUid === control.uid,
      lastUpdate: props.project.lastUpdate,
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
    this.debouncedControlResize = debounce(100, this.controlResize.bind(this));
  }

  componentDidMount() {
    ProjectStateStore.addChangeListener(this.boundHandleStoreChange);
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ProjectStateStore.removeChangeListener(this.boundHandleStoreChange);
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
  }

  componentWillReceiveProps(nextProps) {
    const { project, control } = nextProps;
    const projectState = ProjectStateStore.getProjectState(project);

    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'control' && projectState.selection.controlUid === control.uid,
      lastUpdate: project.lastUpdate
    });
  }

  handleStoreChange() {
    const { project, control } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);

    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'control' && projectState.selection.controlUid === control.uid,
      lastUpdate: project.lastUpdate
    });
  }

  controlResize(dir, size, rect, delta) {
    const { project, control } = this.props;

    control.height = size.height;
    control.width = size.width;
    Facade.projects.dirtify(project);
  }

  select() {
    const { project, window, control } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);
    projectState.selection = {
      type: 'control',
      windowUid: window.uid,
      controlUid: control.uid
    };
    ProjectActionCreators.stateRefresh(project);
  }

  render() {
    const { control, connectDragSource, connectDragPreview, isDragging } = this.props;
    const styles = getStyles(this.props, this.state);

    if(isDragging) {
      return null;
    }

    return (
      <div style={styles.controlContainer}
           onClick={base.utils.stopPropagationWrapper(this.select.bind(this))}>
        <ResizableBox width={control.width}
                      height={control.height}
                      onResize={this.debouncedControlResize}
                      isResizable={{ right: true, bottom: true, bottomRight: true }}>
          {connectDragPreview(
            <div style={styles.control}>
              {connectDragSource(<div style={styles.moveHandle}/>)}
            </div>
          )}
        </ResizableBox>
      </div>
    );
  }
}

CanvasControl.propTypes = {
  project: React.PropTypes.object.isRequired,
  window: React.PropTypes.object.isRequired,
  control: React.PropTypes.object.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  connectDragPreview: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};

CanvasControl.contextTypes = {
  muiTheme: React.PropTypes.object
};

CanvasControl.childContextTypes = {
  muiTheme: React.PropTypes.object
};

const controlSource = {
  beginDrag(props, monitor, uiControl) {
    uiControl.select();
    return {};
  },

  endDrag(props, monitor, uiControl) {
    if(!monitor.didDrop()) { return; }

    const { project, window, control } = props;

    const { delta } = monitor.getDropResult();
    control.x += delta.x / window.width;
    control.y += delta.y / window.height;
    Facade.projects.dirtify(project);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

export default dnd.DragSource(AppConstants.DragTypes.UI_CONTROL, controlSource, collect)(CanvasControl);
