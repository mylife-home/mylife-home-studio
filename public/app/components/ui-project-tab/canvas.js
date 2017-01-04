'use strict';

import React from 'react';

import storeHandler from '../../compat/store';

import CanvasComponentContainer from '../../containers/ui-project-tab/canvas-component-container';
import CanvasImageContainer from '../../containers/ui-project-tab/canvas-image-container';
import CanvasWindowContainer from '../../containers/ui-project-tab/canvas-window-container';

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
    const { project } = this.props;
    const projectState = getProjectState(storeHandler.getStore().getState(), { project: project && project.uid });
    const activeContent = projectState && projectState.activeContent;
    this.setState({ activeContent });
  }

  render() {
    const project = this.props.project;
    const activeContent = this.state.activeContent;

    if(activeContent) {
      switch(activeContent.type) {
        case 'component': {
          return (<CanvasComponentContainer project={project.uid} component={activeContent.uid} />);
        }

        case 'image': {
          return (<CanvasImageContainer project={project.uid} image={activeContent.uid} />);
        }

        case 'window': {
          return (<CanvasWindowContainer project={project.uid} window={activeContent.uid} />);
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