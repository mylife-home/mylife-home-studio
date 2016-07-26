'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';

import DataImage from './data-image';

const styles = {
  container: {
    position : 'relative',
    height   : 'calc(100% - 80px)'
  },
  imageContent : {
    position : 'absolute',
    top      : 0,
    left     : 0,
    right    : 0,
    bottom   : 0,
    margin   : 'auto'
  }
};

class Canvas extends React.Component {

  constructor(props) {
    super(props);

    this.state = { };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
    ProjectStateStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
    ProjectStateStore.removeChangeListener(this.boundHandleStoreChange);
  }

  handleStoreChange() {
    const project = this.props.project;
    const projectVersion = project && project.version;
    const state = ProjectStateStore.getProjectState(project);
    const activeContent = state.activeContent;
    this.setState({ projectVersion, activeContent });
  }


  renderComponent(component) {
    return <div>component</div>;
  }

  renderImage(image) {
    return (
      <div style={styles.container}>
        <DataImage style={styles.imageContent} data={image.content} />
      </div>
    );
  }

  renderWindow(window) {
    return <div>window</div>;
  }

  render() {
    const project = this.props.project;
    const activeContent = this.state.activeContent;

    if(activeContent) {
      switch(activeContent.type) {
        case 'component':
          return this.renderComponent(component);
          const component = project.components.find(comp => comp.id === activeContent.id);

        case 'image':
          const image = project.images.find(img => img.uid === activeContent.uid);
          return this.renderImage(image);

        case 'window':
          const window = project.windows.find(wnd => wnd.uid === activeContent.uid);
          return this.renderWindow(window);
      }
    }

    return null; // project -> no render
  }
}

Canvas.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Canvas;