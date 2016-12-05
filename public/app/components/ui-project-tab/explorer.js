'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';
import { sortBy } from '../../utils/index';

import ProjectStore from '../../stores/project-store';
import AppDispatcher from '../../dispatcher/app-dispatcher';
import { projectStateSelectAndActiveContent } from '../../actions/index';

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
    let projectVersion = project && project.version;
    this.setState({ projectVersion });
  }

  renderComponents() {
    const project = this.props.project;

    return sortBy(project.components, 'id').map(comp => (
      <mui.ListItem key={`component:${comp.id}`}
                    primaryText={comp.id}
                    leftIcon={<icons.Component />}
                    onClick={this.select.bind(this, { type: 'component', id: comp.id})} />
    ));
  }

  renderImages() {
    const project = this.props.project;

    return sortBy(project.images, 'id').map(img => (
      <mui.ListItem key={`image:${img.uid}`}
                    primaryText={img.id}
                    leftIcon={<icons.UiImage />}
                    onClick={this.select.bind(this, { type: 'image', uid: img.uid})} />
    ));
  }

  renderWindows() {
    const project = this.props.project;

    return sortBy(project.windows, 'id').map(window => (
      <mui.ListItem key={`window:${window.uid}`}
                    primaryText={window.id}
                    leftIcon={<icons.UiWindow />}
                    onClick={this.select.bind(this, { type: 'window', uid: window.uid})} />
    ));
  }

  select(data) {
    const { project } = this.props;
    AppDispatcher.dispatch(projectStateSelectAndActiveContent(project, data, data));
  }

  render() {
    const project = this.props.project;

    return (
      <div style={Object.assign({}, tabStyles.fullHeight)}>
        <mui.List style={Object.assign({}, tabStyles.scrollable, styles.listHeight)}>
          <mui.ListItem key={'project'}
                        primaryText={'Project'}
                        leftIcon={<icons.tabs.Ui />}
                        onClick={this.select.bind(this, null)} />
          <mui.ListItem key={'components'}
                        primaryText={'Components'}
                        leftIcon={<icons.Component />}
                        disabled={true}
                        nestedItems={this.renderComponents()} />
          <mui.ListItem key={'images'}
                        primaryText={'Images'}
                        leftIcon={<icons.UiImage />}
                        disabled={true}
                        nestedItems={this.renderImages()} />
          <mui.ListItem key={'windows'}
                        primaryText={'Windows'}
                        leftIcon={<icons.UiWindow />}
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