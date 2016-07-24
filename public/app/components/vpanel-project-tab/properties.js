'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

const styles = {
  cell: {
    display: 'inline-block',
    fontSize: '16px',
    lineHeight: '24px',
    marginLeft: '10px',
    marginRight: '30px'
  },
  valueContainer: {
    display: 'inline-block',
    fontSize: '16px',
    lineHeight: '24px',
    height: '48px',
  },
  value: {
    marginTop: '12px',
    marginBottom: '12px',
  },
};

class Properties extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      selection: null,
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

  renderCellLabel(text) {
    return (<div style={styles.cell}>{text}</div>);
  }

  renderCellValue(text) {
    return (
      <div style={styles.valueContainer}>
        <div style={styles.value}>
          {text}
        </div>
      </div>
    );
  }

  renderComponent(project, component) {
    const onDelete = () => {
      this.selectProject();
      ProjectActionCreators.deleteComponent(project, component);
    };
    const pluginConfig = component.plugin.config;

    return (
      <div>
        <base.PropertiesTitle icon={<base.icons.Component/>} text={component.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr><td>{this.renderCellLabel('Id')}</td><td><base.PropertiesEditor project={project} object={component} property={'id'} type={'s'} /></td></tr>
            {pluginConfig.map(prop => (
              <tr key={prop.name}>
                <td>
                  {this.renderCellLabel(prop.name)}
                </td>
                <td>
                  <base.PropertiesEditor
                    project={project}
                    object={component.config}
                    property={prop.name}
                    type={prop.type} />
                </td>
              </tr>))
            }
          </tbody>
        </table>
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
        <base.PropertiesTitle icon={<base.icons.Binding/>} text={key} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><base.PropertiesLabel text={'Remote component'}/></td>
              <td><base.PropertiesValue value={binding.remote.id}/></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Remote attribute'}/></td>
              <td><base.PropertiesValue value={binding.remote_attribute}/></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Local component'}/></td>
              <td><base.PropertiesValue value={binding.local.id}/></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Local action'}/></td>
              <td><base.PropertiesValue value={binding.local_action}/></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderProject(project) {
    return (
      <div>
        <base.PropertiesTitle icon={<base.icons.tabs.VPanel/>} text={'Project'} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><base.PropertiesLabel text={'Name'}/></td>
              <td><base.PropertiesEditor project={project} object={project} property={'name'} type={'s'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Creation'}/></td>
              <td><base.PropertiesValue value={project.creationDate.toISOString()}/></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Last update'}/></td>
              <td><base.PropertiesValue value={project.lastUpdate.toISOString()}/></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  findComponent(project, uid) {
    return project.components.find(c => c.uid === uid);
  }

  findBinding(project, uid) {
    return project.bindings.find(b => b.uid === uid);
  }

  render() {
    const { project } = this.props;
    const { selection } = this.state;

    switch(selection && selection.type) {
      case 'component': {
        const component = this.findComponent(project, selection.uid);
        return this.renderComponent(project, component);
      }

      case 'binding': {
        const binding = this.findBinding(project, selection.uid);
        return this.renderBinding(project, binding);
      }
    }

    return this.renderProject(project);
  }
}

Properties.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Properties;