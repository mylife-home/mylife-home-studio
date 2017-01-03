'use strict';

import React from 'react';
import icons from '../icons';

import PropertiesComponentContainer from '../../containers/vpanel-project-tab/properties-component-container';
import PropertiesBindingContainer from '../../containers/vpanel-project-tab/properties-binding-container';
import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesValue from '../properties/properties-value';
import PropertiesEditor from '../properties/properties-editor';
import storeHandler from '../../compat/store';
import AppDispatcher from '../../compat/dispatcher';
import { projectChangeName } from '../../actions/index';
import { getProjectState } from '../../selectors/projects';

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
      case 'component':
        return (<PropertiesComponentContainer project={project.uid} component={selection.uid} />);

      case 'binding': {
        return (<PropertiesBindingContainer project={project.uid} binding={selection.uid} />);
      }
    }

    return this.renderProject(project);
  }
}

Properties.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Properties;