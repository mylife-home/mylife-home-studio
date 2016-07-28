'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import ResizableBox from 'react-resizable-box';
import { throttle, debounce } from 'throttle-debounce';
import base from '../base/index';
import commonStyles from './canvas-styles';

import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

function getStyles(props, state) {
  const { muiTheme, isSelected } = state;
  const { baseTheme } = muiTheme;

  const backColor = (isSelected ? baseTheme.palette.primary1Color : baseTheme.palette.primary3Color);
  const foreColor = (isSelected ? baseTheme.palette.alternateTextColor : baseTheme.palette.textColor);

  return Object.assign({
    window: {
      height: '100%',
      border: '1px solid ' + backColor
    },
    windowContainer: {
      margin: '10px'
    }
  }, commonStyles);
}

class CanvasWindow extends React.Component {

  constructor(props, context) {
    super(props, context);

    const { project, window } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);

    this.state = {
      isSelected: projectState.selection && projectState.selection.type === 'window' && projectState.selection.uid === window.uid,
      lastUpdate: props.project.lastUpdate,
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
    this.debouncedWindowResize = debounce(100, this.windowResize.bind(this));
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
    const { project, window } = nextProps;
    const projectState = ProjectStateStore.getProjectState(project);

    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'window' && projectState.selection.uid === window.uid,
      lastUpdate: project.lastUpdate
    });
  }

  handleStoreChange() {
    const { project, window } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);

    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'window' && projectState.selection.uid === window.uid,
      lastUpdate: project.lastUpdate
    });
  }

  windowResize(dir, size, rect, delta) {
    const { project, window } = this.props;

    window.height = size.height;
    window.width = size.width;
    ProjectActionCreators.refresh(project);
  }

  render() {
    const { window } = this.props;
    const styles = getStyles(this.props, this.state);

    return (
      <div style={styles.container}>
        <div style={styles.windowContainer}>
          <ResizableBox width={window.width}
                        height={window.height}
                        onResize={this.debouncedWindowResize}>
            <div style={styles.window}>
              window
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
};

CanvasWindow.contextTypes = {
  muiTheme: React.PropTypes.object
};

CanvasWindow.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default CanvasWindow;