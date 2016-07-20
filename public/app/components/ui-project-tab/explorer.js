'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

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
  }

  renderComponents() {
    const project = this.props.project;

    return project.components.map(comp => (
      <mui.ListItem key={`component:${comp.id}`} primaryText={comp.id} leftIcon={<base.icons.Component />} />
    ));
  }

  renderImages() {
    const project = this.props.project;

    return project.images.map(img => (
      <mui.ListItem key={`image:${img.uid}`} primaryText={img.id} leftIcon={<base.icons.UiImage />} />
    ));
  }

  renderWindows() {
    const project = this.props.project;

    return project.windows.map(window => (
      <mui.ListItem key={`window:${window.uid}`} primaryText={window.id} leftIcon={<base.icons.UiWindow />} />
    ));
  }

  render() {
    const project = this.props.project;
console.log(project);
    return (
      <div style={Object.assign({}, tabStyles.fullHeight)}>
        <mui.List style={Object.assign({}, tabStyles.scrollable, styles.listHeight)}>
          <mui.ListItem key={'project'} primaryText={'Project'} leftIcon={<base.icons.tabs.Ui />} />
          <mui.ListItem key={'components'} primaryText={'Components'} leftIcon={<base.icons.Component />} disabled={true} nestedItems={this.renderComponents()} />
          <mui.ListItem key={'images'} primaryText={'Images'} leftIcon={<base.icons.UiImage />} disabled={true} nestedItems={this.renderImages()} />
          <mui.ListItem key={'windows'} primaryText={'Windows'} leftIcon={<base.icons.UiWindow />} disabled={true} nestedItems={this.renderWindows()} />
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