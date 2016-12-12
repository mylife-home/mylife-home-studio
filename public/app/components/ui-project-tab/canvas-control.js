'use strict';

import React from 'react';
import * as muiStyles from 'material-ui/styles/index';
import * as dnd from 'react-dnd';
import ResizableBox from 'react-resizable-box';
import { debounce } from 'throttle-debounce';

import { stopPropagationWrapper } from '../../utils/index';

import DataImage from './data-image';

import { dragTypes } from '../../constants/index';
import ProjectStore from '../../stores/project-store';
import AppDispatcher from '../../compat/dispatcher';
import { projectStateSelect, projectMoveControl, projectResizeControl } from '../../actions/index';

function getStyles(props, state) {
  const { window, control } = props;
  const { muiTheme, isSelected } = state;
  const { baseTheme } = muiTheme;

  const backColor = (isSelected ? baseTheme.palette.primary1Color : baseTheme.palette.primary3Color);
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
    },
    item: {
      height: '100%',
      width: '100%'
    }
  });
}

class CanvasControl extends React.Component {

  constructor(props, context) {
    super(props, context);

    const { project, control } = this.props;
    const projectState = ProjectStore.getProjectState(project);

    this.state = {
      isSelected: projectState.selection && projectState.selection.type === 'control' && projectState.selection.controlUid === control.uid,
      lastUpdate: props.project.lastUpdate,
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
    this.debouncedControlResize = debounce(100, this.controlResize.bind(this));
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
  }

  componentWillReceiveProps(nextProps) {
    const { project, control } = nextProps;
    const projectState = ProjectStore.getProjectState(project);

    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'control' && projectState.selection.controlUid === control.uid,
      lastUpdate: project.lastUpdate
    });
  }

  handleStoreChange() {
    const { project, control } = this.props;
    const projectState = ProjectStore.getProjectState(project);

    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'control' && projectState.selection.controlUid === control.uid,
      lastUpdate: project.lastUpdate
    });
  }

  controlResize(dir, size) {
    const { project, window, control } = this.props;

    AppDispatcher.dispatch(projectResizeControl(project, window, control, size));
  }

  select() {
    const { project, window, control } = this.props;
    AppDispatcher.dispatch(projectStateSelect(project, {
      type: 'control',
      windowUid: window.uid,
      controlUid: control.uid
    }));
  }

  renderText(control, styles) {
    return (
      <div style={Object.assign({ overflow: 'hidden' }, styles.item)}>
        {control.text.format}
      </div>
    );
  }

  renderDisplay(control, styles) {
    return (<DataImage image={control.display.defaultResource} style={styles.item}/>);
  }

  render() {
    const { control, connectDragSource, connectDragPreview, isDragging } = this.props;
    const styles = getStyles(this.props, this.state);

    if(isDragging) {
      return null;
    }

    return (
      <div style={styles.controlContainer}
           onClick={stopPropagationWrapper(this.select.bind(this))}>
        <ResizableBox width={control.width}
                      height={control.height}
                      onResize={this.debouncedControlResize}
                      isResizable={{ right: true, bottom: true, bottomRight: true }}>
          {connectDragPreview(
            <div style={styles.control}>
              {control.text ? this.renderText(control, styles) : this.renderDisplay(control, styles)}
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

  endDrag(props, monitor) {
    if(!monitor.didDrop()) { return; }

    const { project, window, control } = props;

    const { delta } = monitor.getDropResult();
    AppDispatcher.dispatch(projectMoveControl(project, window, control, {
      x: control.x + delta.x / window.width,
      y: control.y + delta.y / window.height
    }));
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

export default dnd.DragSource(dragTypes.UI_CONTROL, controlSource, collect)(CanvasControl);
