'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

import Toolbar from './toolbar';

import tabStyles from '../base/tab-styles';

const styles = {
  listHeight: {
    height: 'calc(100% - 74px)'
  }
};

class Explorer extends React.Component {

  constructor(props) {
    super(props);

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
    let projectVersion = project && project.version;
    this.setState({ projectVersion });
  }

  renderComponents() {
    const project = this.props.project;

    return project.components.map(comp => (
      <mui.ListItem key={`component:${comp.id}`}
                    primaryText={comp.id}
                    leftIcon={<base.icons.Component />}
                    onClick={this.select.bind(this, { type: 'component', id: comp.id})} />
    ));
  }

  renderImages() {
    const project = this.props.project;

    return project.images.map(img => (
      <mui.ListItem key={`image:${img.uid}`}
                    primaryText={img.id}
                    leftIcon={<base.icons.UiImage />}
                    onClick={this.select.bind(this, { type: 'image', uid: img.uid})} />
    ));
  }

  renderWindows() {
    const project = this.props.project;

    return project.windows.map(window => (
      <mui.ListItem key={`window:${window.uid}`}
                    primaryText={window.id}
                    leftIcon={<base.icons.UiWindow />}
                    onClick={this.select.bind(this, { type: 'window', uid: window.uid})} />
    ));
  }

  select(data) {
    const project = this.props.project;
    const state = ProjectStateStore.getProjectState(project);
    state.activeContent = data;
    ProjectActionCreators.stateRefresh(project);
  }

  render() {
    const project = this.props.project;

    return (
      <div style={Object.assign({}, tabStyles.fullHeight)}>
        <mui.List style={Object.assign({}, tabStyles.scrollable, styles.listHeight)}>
          <mui.ListItem key={'project'}
                        primaryText={'Project'}
                        leftIcon={<base.icons.tabs.Ui />}
                        onClick={this.select.bind(this, null)} />
          <mui.ListItem key={'components'}
                        primaryText={'Components'}
                        leftIcon={<base.icons.Component />}
                        disabled={true}
                        nestedItems={this.renderComponents()} />
          <mui.ListItem key={'images'}
                        primaryText={'Images'}
                        leftIcon={<base.icons.UiImage />}
                        disabled={true}
                        nestedItems={this.renderImages()} />
          <mui.ListItem key={'windows'}
                        primaryText={'Windows'}
                        leftIcon={<base.icons.UiWindow />}
                        disabled={true}
                        nestedItems={this.renderWindows()} />
        </mui.List>
        <Toolbar project={project} />
      </div>
    );
  }
}

Explorer.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Explorer;