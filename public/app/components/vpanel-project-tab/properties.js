'use strict';

import React from 'react';
import * as mui from 'material-ui';
import icons from '../icons';

import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesValue from '../properties/properties-value';
import PropertiesEditor from '../properties/properties-editor';
import storeHandler from '../../compat/store';
import AppDispatcher from '../../compat/dispatcher';
import {
  projectChangeName,
  projectDeleteBinding,
  projectDeleteComponent, projectComponentChangeId, projectComponentChangeConfig
} from '../../actions/index';
import { getProjectState } from '../../selectors/projects';

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
    this.unsubscribe = storeHandler.getStore().subscribe(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleStoreChange() {
    const { project } = this.props;
    const projectState = getProjectState(storeHandler.getStore().getState(), { project: project && project.uid });
    this.setState({
      selection : projectState && projectState.selection
    });
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
              <td><PropertiesEditor id={`${component.uid}_id`} value={component.id} onChange={(value) => projectComponentChangeId(project, component, value)} type={'s'} /></td>
            </tr>
            {pluginConfig.map(prop => (
              <tr key={prop.name}>
                <td>
                  <PropertiesLabel text={prop.name} />
                </td>
                <td>
                  <PropertiesEditor
                    id={`${component.uid}_config_${prop.name}`}
                    value={component.config[prop.name]}
                    onChange={(value) => projectComponentChangeConfig(project, component, prop.name, value)}
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
              <td><PropertiesEditor id={`${project.uid}_name`} value={project.name} onChange={(value) => AppDispatcher.dispatch(projectChangeName(project.uid, value))} type={'s'} /></td>
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