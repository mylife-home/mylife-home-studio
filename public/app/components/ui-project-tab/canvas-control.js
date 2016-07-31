'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import ResizableBox from 'react-resizable-box';
import { throttle, debounce } from 'throttle-debounce';
import base from '../base/index';

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

console.log(control);

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
  });
}

class CanvasWindow extends React.Component {

  constructor(props, context) {
    super(props, context);

    const { project, control } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);

    this.state = {
      isSelected: projectState.selection && projectState.selection.type === 'control' && projectState.selection.uid === control.uid,
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
      isSelected: projectState.selection && projectState.selection.type === 'control' && projectState.selection.uid === control.uid,
      lastUpdate: project.lastUpdate
    });
  }

  handleStoreChange() {
    const { project, control } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);

    this.setState({
      isSelected: projectState.selection && projectState.selection.type === 'control' && projectState.selection.uid === control.uid,
      lastUpdate: project.lastUpdate
    });
  }

  controlResize(dir, size, rect, delta) {
    const { project, control } = this.props;

    control.height = size.height;
    control.width = size.width;
    ProjectActionCreators.refresh(project);
  }

  render() {
    const { control } = this.props;
    const styles = getStyles(this.props, this.state);

    return (
      <div style={styles.controlContainer}>
        <ResizableBox width={control.width}
                      height={control.height}
                      onResize={this.debouncedControlResize}>
          <div style={styles.control}>
            TODO
          </div>
        </ResizableBox>
      </div>
    );
  }
}

CanvasWindow.propTypes = {
  project: React.PropTypes.object.isRequired,
  window: React.PropTypes.object.isRequired,
  control: React.PropTypes.object.isRequired,
};

CanvasWindow.contextTypes = {
  muiTheme: React.PropTypes.object
};

CanvasWindow.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default CanvasWindow;