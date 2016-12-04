'use strict';

import React from 'react';
import * as muiStyles from 'material-ui/styles/index';
import * as dnd from 'react-dnd';
import ResizableBox from 'react-resizable-box';
import { debounce } from 'throttle-debounce';
import base from '../base/index';
import commonStyles from './canvas-styles';

import DataImage from './data-image';
import CanvasControl from './canvas-control';

import Facade from '../../services/facade';
import AppConstants from '../../constants/app-constants';
import ProjectStore from '../../stores/project-store';
import AppDispatcher from '../../dispatcher/app-dispatcher';
import { projectStateSelect } from '../../actions/index';

function getStyles(props, state) {
  const { muiTheme, isSelected } = state;
  const { baseTheme } = muiTheme;

  const backColor = (isSelected ? baseTheme.palette.primary1Color : baseTheme.palette.primary3Color);

  return Object.assign({
    windowContainer: {
      margin: '10px'
    },
    window: {
      height: '100%',
      border: '1px solid ' + backColor,
      position: 'relative'
    },
    background: {
      height: '100%',
      width: '100%'
    }
  }, commonStyles);
}

class CanvasWindow extends React.Component {

  constructor(props, context) {
    super(props, context);

    const { project, window } = this.props;
    const projectState = ProjectStore.getProjectState(project);

    this.state = {
      isSelected: projectState.selection && projectState.selection.type === 'window' && projectState.selection.uid === window.uid,
      lastUpdate: props.project.lastUpdate,
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
    this.debouncedWindowResize = debounce(100, this.windowResize.bind(this));
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
  }

  componentWillReceiveProps(nextProps) {
    const { project, window } = nextProps;
    const projectState = ProjectStore.getProjectState(project);

    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'window' && projectState.selection.uid === window.uid,
      lastUpdate: project.lastUpdate
    });
  }

  handleStoreChange() {
    const { project, window } = this.props;
    const projectState = ProjectStore.getProjectState(project);

    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'window' && projectState.selection.uid === window.uid,
      lastUpdate: project.lastUpdate
    });
  }

  windowResize(dir, size) {
    const { project, window } = this.props;

    window.height = size.height;
    window.width = size.width;
    Facade.projects.dirtify(project);
  }

  select() {
    const { project, window } = this.props;
    AppDispatcher.dispatch(projectStateSelect(project, { type: 'window', uid: window.uid }));
  }

  render() {
    const { project, window, connectDropTarget } = this.props;
    const styles = getStyles(this.props, this.state);

    return connectDropTarget(
      <div style={styles.container}
           onClick={base.utils.stopPropagationWrapper(this.select.bind(this))}>
        <div style={styles.windowContainer}>
          <ResizableBox width={window.width}
                        height={window.height}
                        onResize={this.debouncedWindowResize}
                        isResizable={{ right: true, bottom: true, bottomRight: true }}>
            <div ref="canvas"
                 style={styles.window}>
              <DataImage image={window.backgroundResource} style={styles.background}/>
              {window.controls.map((ctrl) => (
                <CanvasControl key={ctrl.uid} project={project} window={window} control={ctrl} />))}
            </div>
          </ResizableBox>
        </div>
      </div>
    );
  }
}

CanvasWindow.propTypes = {
  project: React.PropTypes.object.isRequired,
  window: React.PropTypes.object.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
};

CanvasWindow.contextTypes = {
  muiTheme: React.PropTypes.object
};

CanvasWindow.childContextTypes = {
  muiTheme: React.PropTypes.object
};

const canvasTarget = {
  drop(props, monitor, component) {
    switch(monitor.getItemType()) {
      case AppConstants.DragTypes.UI_TOOLBOX_CONTROL: {
        const canvasRect = component.refs.canvas.getBoundingClientRect();
        const dropOffset = monitor.getClientOffset();
        const location = { x: dropOffset.x - canvasRect.left, y: dropOffset.y - canvasRect.top };
        // handled in ToolboxControl/endDrag
        return { location };
      }

      case AppConstants.DragTypes.UI_CONTROL: {
        // handled in CanvasControl/endDrag
        return { delta: monitor.getDifferenceFromInitialOffset() };
      }
    }
  }
};

function collect(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

export default dnd.DropTarget([AppConstants.DragTypes.UI_TOOLBOX_CONTROL, AppConstants.DragTypes.UI_CONTROL], canvasTarget, collect)(CanvasWindow);
