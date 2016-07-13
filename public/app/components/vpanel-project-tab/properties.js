'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

function getStyles(props, state) {
  const { baseTheme } = state.muiTheme;

  return {
    titleContainer: {
      background : baseTheme.palette.primary3Color,
      color      : baseTheme.palette.textColor,
    },
    titleText: {
      whiteSpace    : 'nowrap',
      overflow      : 'hidden',
      textOverflow  : 'ellipsis',
      margin        : 0,
      paddingTop    : 2,
      paddingLeft   : 8,
      paddingRight  : 8,
      letterSpacing : 0,
      fontSize      : 16,
      fontWeight    : 'normal',
      height        : '25px',
      lineHeight    : '25px'
    },
    titleIconContainer: {
      float  : 'left',
      width  : '25px',
      height : '25px'
    },
    titleIcon: {
      textAlign     : 'center',
      height        : '25px',
      lineHeight    : '25px',
      verticalAlign : 'middle'
    },
  };
}

class Properties extends React.Component {

  constructor(props, context) {
    super(props);

    this.state = {
      selection: null,
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.handleStoreChange.bind(this));
    ProjectStateStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.handleStoreChange.bind(this));
    ProjectStateStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
    const { project } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);
    this.setState({
      selection : projectState.selection
    });
  }

  renderTitle(Icon, text) {
    const styles = getStyles(this.props, this.state);
    return (
      <div style={styles.titleContainer}>
        <div style={styles.titleIconContainer}>
          <Icon color={styles.titleContainer.color} style={styles.titleIcon} />
        </div>
        <div style={styles.titleText}>
          {text}
        </div>
      </div>
    );
  }

  renderComponent(component) {
    return (
      <div>
        {this.renderTitle(base.icons.Component, component.id)}
      </div>
    );
  }

  renderBinding(binding) {
    const key = `${binding.remote.id}:${binding.remote_attribute} -> ${binding.local.id}:${binding.local_action}`;
    return (
      <div>
        {this.renderTitle(base.icons.Binding, key)}
      </div>
    );
  }

  renderProject(project) {
    return (
      <div>
        {this.renderTitle(base.icons.tabs.VPanel, 'Project')}
      </div>
    );
  }

  findComponent(project, componentId) {
    return project.components.find(c => c.id === componentId);
  }

  render() {
    const { project } = this.props;
    const { selection } = this.state;

    switch(selection && selection.type) {
      case 'component': {
        const component = this.findComponent(project, selection.id);
        return this.renderComponent(component);
      }

      case 'binding': {
        const component = this.findComponent(project, selection.localId);
        const binding = component.bindings.find(b =>
          b.remote.id === selection.remoteId &&
          b.remote_attribute === selection.remoteAttribute &&
          b.local_action === selection.localAction);
        return this.renderBinding(binding);
      }
    }

    return this.renderProject(project);
  }
}

Properties.propTypes = {
  project: React.PropTypes.object.isRequired,
};

Properties.contextTypes = {
  muiTheme: React.PropTypes.object
};

Properties.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default Properties;