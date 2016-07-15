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
    titleContainer : {
      textAlign    : 'center',
      background   : baseTheme.palette.primary3Color,
      color        : baseTheme.palette.textColor,
    },
    titleItem: {
      verticalAlign : 'middle',
      marginTop     : 0,
      marginBottom  : 0,
      whiteSpace    : 'nowrap',
      overflow      : 'hidden',
      textOverflow  : 'ellipsis',
      letterSpacing : 0,
      fontSize      : 16,
      fontWeight    : 'normal',
    },
    titleLeft: {
      float   : 'left',
      height  : '48px',
      width   : '48px',
      padding : '12px',
    },
    titleRight: {
      float: 'right',
    },
    titleMain: {
      lineHeight: '48px',
    }
  };
}

class Properties extends React.Component {

  constructor(props, context) {
    super(props);

    this.state = {
      selection: null,
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };

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
    const { project } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);
    this.setState({
      selection : projectState.selection
    });
  }

  selectProject() {
    const project = this.props.project;
    const state = ProjectStateStore.getProjectState(project);
    state.selection = null;
    ProjectActionCreators.stateRefresh(project);
  }

  renderTitle(Icon, text, onDelete) {
    const styles = getStyles(this.props, this.state);
    return (
      <div style={styles.titleContainer}>
        <div style={Object.assign({}, styles.titleItem, styles.titleLeft)}>
          <Icon/>
        </div>
        {(() => {
          if(!onDelete) { return; }
          return (
            <mui.IconButton onClick={onDelete} style={Object.assign({}, styles.titleItem, styles.titleRight)}>
              <base.icons.actions.Close/>
            </mui.IconButton>);
        })()}
        <div style={Object.assign({}, styles.titleItem, styles.titleMain)}>
          {text}
        </div>
      </div>
    );
  }

  renderComponent(project, component) {
    const onDelete = () => {
      this.selectProject();
      ProjectActionCreators.deleteComponent(project, component);
    }
    return (
      <div>
        {this.renderTitle(base.icons.Component, component.id, onDelete)}
      </div>
    );
  }

  renderBinding(project, binding) {
    const key = `${binding.remote.id}:${binding.remote_attribute} -> ${binding.local.id}:${binding.local_action}`;
    const onDelete = () => {
      this.selectProject();
      ProjectActionCreators.deleteBinding(project, binding);
    }
    return (
      <div>
        {this.renderTitle(base.icons.Binding, key, onDelete)}
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
        return this.renderComponent(project, component);
      }

      case 'binding': {
        const component = this.findComponent(project, selection.localId);
        const binding = component.bindings.find(b =>
          b.remote.id === selection.remoteId &&
          b.remote_attribute === selection.remoteAttribute &&
          b.local_action === selection.localAction);
        return this.renderBinding(project, binding);
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