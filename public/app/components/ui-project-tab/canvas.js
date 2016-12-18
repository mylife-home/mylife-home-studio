'use strict';

import React from 'react';

import storeHandler from '../../compat/store';

import CanvasComponent from './canvas-component';
import CanvasImage from './canvas-image';
import CanvasWindow from './canvas-window';

import { getProjectState } from '../../selectors/projects';

class Canvas extends React.Component {

  constructor(props) {
    super(props);

    this.state = { };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = storeHandler.getStore().subscribe(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleStoreChange() {
    const project = this.props.project;
    const projectVersion = project && project.version;
    const projectState = getProjectState(storeHandler.getStore().getState(), { project: project && project.uid });
    const activeContent = projectState && projectState.activeContent;
    this.setState({ projectVersion, activeContent });
  }

  render() {
    const project = this.props.project;
    const activeContent = this.state.activeContent;

    if(activeContent) {
      switch(activeContent.type) {
        case 'component': {
          const component = project.components.get(activeContent.uid);
          return (<CanvasComponent component={component} />);
        }

        case 'image': {
          const image = project.images.get(activeContent.uid);
          return (<CanvasImage image={image} />);
        }

        case 'window': {
          const window = project.windows.get(activeContent.uid);
          return (<CanvasWindow project={project} window={window} />);
        }
      }
    }

    return null; // project -> no render
  }
}

Canvas.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Canvas;