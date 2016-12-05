'use strict';

import React from 'react';
import base from '../base/index';
import icons from '../icons';

import ProjectStore from '../../stores/project-store';

import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesValue from '../properties/properties-value';

import PropertiesImage from './properties-image';
import PropertiesControl from './properties-control';
import PropertiesImageSelector from './properties-image-selector';
import PropertiesWindowSelector from './properties-window-selector';

import AppDispatcher from '../../compat/dispatcher';

import {
  dialogError,
  projectStateSelectAndActiveContent, projectDeleteWindow, projectDeleteComponent
} from '../../actions/index';

class Properties extends React.Component {

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
    const projectVersion = project && project.version;
    const state = ProjectStore.getProjectState(project);
    const selection = state.selection;
    this.setState({ projectVersion, selection });
  }

  select(data) {
    const { project } = this.props;
    AppDispatcher.dispatch(projectStateSelectAndActiveContent(project, data, data));
  }

  renderProject(project) {
    return (
      <div>
        <PropertiesTitle icon={<icons.tabs.Ui/>} text={'Project'} />
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
            <tr>
              <td><PropertiesLabel text={'Default window'}/></td>
              <td><PropertiesWindowSelector project={project} object={project} property={'defaultWindow'} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderComponent(project, component) {
    const onDelete = () => {
      try {
        this.select(null);
        projectDeleteComponent(project, component);
      } catch(err) {
        AppDispatcher.dispatch(dialogError(err));
      }
    };

    return (
      <div>
        <PropertiesTitle icon={<icons.Component/>} text={component.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><PropertiesLabel text={'Id'} /></td>
              <td><PropertiesValue value={component.id} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderWindow(project, window) {
    const onDelete = () => {
      try {
        this.select(null);
        projectDeleteWindow(project, window);
      } catch(err) {
        AppDispatcher.dispatch(dialogError(err));
      }
    };

    return (
      <div>
        <PropertiesTitle icon={<icons.UiWindow/>} text={window.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><PropertiesLabel text={'Id'} /></td>
              <td><base.PropertiesEditor project={project} object={window} property={'id'} type={'s'} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Width'} /></td>
              <td><base.PropertiesEditor project={project} object={window} property={'width'} type={'i'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Height'} /></td>
              <td><base.PropertiesEditor project={project} object={window} property={'height'} type={'i'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Background'} /></td>
              <td><PropertiesImageSelector project={project} object={window} property={'backgroundResource'} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const project = this.props.project;
    const selection = this.state.selection;

    if(selection) {
      switch(selection.type) {
        case 'component': {
          const component = project.components.find(comp => comp.uid === selection.uid);
          return this.renderComponent(project, component);
        }

        case 'image': {
          const image = project.images.find(img => img.uid === selection.uid);
          return (<PropertiesImage project={project} image={image} />);
        }

        case 'window': {
          const window = project.windows.find(wnd => wnd.uid === selection.uid);
          return this.renderWindow(project, window);
        }

        case 'control': {
          const window = project.windows.find(wnd => wnd.uid === selection.windowUid);
          const control = window.controls.find(ctrl => ctrl.uid === selection.controlUid);
          return (<PropertiesControl project={project} window={window} control={control} />);
        }
      }
    }

    return this.renderProject(project);
  }
}

Properties.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Properties;
