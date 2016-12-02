'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectStore from '../../stores/project-store';

import CanvasComponent from './canvas-component';
import CanvasImage from './canvas-image';
import CanvasWindow from './canvas-window';

class Canvas extends React.Component {

  constructor(props) {
    super(props);

    this.state = { };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
  }

  handleStoreChange() {
    const project = this.props.project;
    const projectVersion = project && project.version;
    const state = ProjectStore.getProjectState(project);
    const activeContent = state.activeContent;
    this.setState({ projectVersion, activeContent });
  }

  render() {
    const project = this.props.project;
    const activeContent = this.state.activeContent;

    if(activeContent) {
      switch(activeContent.type) {
        case 'component':
          const component = project.components.find(comp => comp.id === activeContent.id);
          return (<CanvasComponent component={component} />);

        case 'image':
          const image = project.images.find(img => img.uid === activeContent.uid);
          return (<CanvasImage image={image} />);

        case 'window':
          const window = project.windows.find(wnd => wnd.uid === activeContent.uid);
          return (<CanvasWindow project={project} window={window} />);
      }
    }

    return null; // project -> no render
  }
}

Canvas.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Canvas;