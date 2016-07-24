'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectActionCreators from '../../actions/project-action-creators';
import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';

class Properties extends React.Component {

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
    const selection = state.selection;
    this.setState({ projectVersion, selection });
  }

  renderProject(project) {
    return <div>project</div>;
  }

  renderComponent(component) {
    return <div>component</div>;
  }

  renderImage(image) {
    return <div>image</div>;
  }

  renderWindow(window) {
    return <div>window</div>;
  }

  renderControl(window, control) {
    return <div>control</div>;
  }

  render() {
    const project = this.props.project;
    const selection = this.state.selection;

    if(selection) {
      switch(selection.type) {
        case 'component': {
          const component = project.components.find(comp => comp.uid === selection.uid);
          return this.renderComponent(component);
        }

        case 'image': {
          const image = project.images.find(img => img.uid === selection.uid);
          return this.renderImage(image);
        }

        case 'window': {
          const window = project.windows.find(wnd => wnd.uid === selection.uid);
          return this.renderWindow(window);
        }

        case 'control': {
          const window = project.windows.find(wnd => wnd.uid === selection.windowUid);
          const control = window.controls.find(ctrl => ctrl.uid === selection.controlUid);
          return this.renderControl(window, control);
        }
      }
    }

    return this.renderProject(project);
  }
}

Properties.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Properties;