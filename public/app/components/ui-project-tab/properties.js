'use strict';

import React from 'react';
import icons from '../icons';

import ProjectStore from '../../stores/project-store';

import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesValue from '../properties/properties-value';
import PropertiesEditor from '../properties/properties-editor';

import PropertiesImage from './properties-image';
import PropertiesControl from './properties-control';
import PropertiesImageSelector from './properties-image-selector';
import PropertiesWindowSelector from './properties-window-selector';

import AppDispatcher from '../../compat/dispatcher';

import {
  dialogError,
  projectStateSelectAndActiveContent, projectChangeName,
  projectDeleteWindow, projectWindowChangeId, projectResizeWindow, projectWindowChangeImage,
  projectDeleteComponent, projectChangeDefaultWindow
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
              <td><PropertiesEditor id={`${project.uid}_name`} value={project.name} onChange={(value) => AppDispatcher.dispatch(projectChangeName(project, value))} type={'s'} /></td>
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
              <td><PropertiesWindowSelector project={project} value={project.defaultWindow} onWindowChange={(window) => AppDispatcher.dispatch(projectChangeDefaultWindow(project, window))} /></td>
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
              <td><PropertiesEditor id={`${window.uid}_id`} value={window.id} onChange={(value) => AppDispatcher.dispatch(projectWindowChangeId(project, window, value))} type={'s'} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Width'} /></td>
              <td><PropertiesEditor id={`${window.uid}_width`} value={window.width} onChange={(value) => AppDispatcher.dispatch(projectResizeWindow(project, window, { height: window.height, width: value }))} type={'i'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Height'} /></td>
              <td><PropertiesEditor id={`${window.uid}_height`} value={window.height} onChange={(value) => AppDispatcher.dispatch(projectResizeWindow(project, window, { height: value, width: window.width }))} type={'i'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Background'} /></td>
              <td><PropertiesImageSelector project={project} image={window.backgroundResource} onImageChange={(img) => AppDispatcher.dispatch(projectWindowChangeImage(project, window, img))} /></td>
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
