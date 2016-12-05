'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';

import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesValue from '../properties/properties-value';

import ProjectStore from '../../stores/project-store';
import AppDispatcher from '../../dispatcher/app-dispatcher';
import { projectStateSelect, projectDeleteBinding, projectDeleteComponent } from '../../actions/index';

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
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
  }

  handleStoreChange() {
    const { project } = this.props;
    const projectState = ProjectStore.getProjectState(project);
    this.setState({
      selection : projectState.selection
    });
  }

  selectProject() {
    const { project } = this.props;
    AppDispatcher.dispatch(projectStateSelect(project, null));
  }

  renderTitle(Icon, text, onDelete) {
    return (
      <div style={styles.titleContainer}>
        <div style={Object.assign({}, styles.titleItem, styles.titleLeft)}>
          <Icon/>
        </div>
        {(() => {
          if(!onDelete) { return; }
          return (
            <mui.IconButton onClick={onDelete} style={Object.assign({}, styles.titleItem, styles.titleRight)}>
              <icons.actions.Close/>
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
      projectDeleteComponent(project, component);
    };
    const pluginConfig = component.plugin.config;

    return (
      <div>
        <PropertiesTitle icon={<icons.Component/>} text={component.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><PropertiesLabel text={'Id'} /></td>
              <td><base.PropertiesEditor project={project} object={component} property={'id'} type={'s'} dirtifyComponent={true} /></td>
            </tr>
            {pluginConfig.map(prop => (
              <tr key={prop.name}>
                <td>
                  <PropertiesLabel text={prop.name} />
                </td>
                <td>
                  <base.PropertiesEditor
                    project={project}
                    object={component.config}
                    property={prop.name}
                    type={prop.type}
                    dirtifyComponent={true} />
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
      projectDeleteBinding(project, binding);
    };

    return (
      <div>
        <PropertiesTitle icon={<icons.Binding/>} text={key} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><PropertiesLabel text={'Remote component'}/></td>
              <td><PropertiesValue value={binding.remote.id}/></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Remote attribute'}/></td>
              <td><PropertiesValue value={binding.remote_attribute}/></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Local component'}/></td>
              <td><PropertiesValue value={binding.local.id}/></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Local action'}/></td>
              <td><PropertiesValue value={binding.local_action}/></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderProject(project) {
    return (
      <div>
        <PropertiesTitle icon={<icons.tabs.VPanel/>} text={'Project'} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><PropertiesLabel text={'Name'}/></td>
              <td><base.PropertiesEditor project={project} object={project} property={'name'} type={'s'} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Creation'}/></td>
              <td><PropertiesValue value={project.creationDate.toISOString()}/></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Last update'}/></td>
              <td><PropertiesValue value={project.lastUpdate.toISOString()}/></td>
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