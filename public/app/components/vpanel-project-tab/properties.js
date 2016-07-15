'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import PropertiesTitle from './properties-title.js';

import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

function getStyles(props, state) {
  const { baseTheme } = state.muiTheme;

  return { };
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
        <PropertiesTitle icon={<base.icons.Component/>} text={component.id} onDelete={onDelete} />
        {/* details */}
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
        <PropertiesTitle icon={<base.icons.Binding/>} text={key} onDelete={onDelete} />
        {/* details */}
      </div>
    );
  }

  renderProject(project) {
    return (
      <div>
        <PropertiesTitle icon={<base.icons.tabs.VPanel/>} text={'Project'} />
        {/* details */}
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