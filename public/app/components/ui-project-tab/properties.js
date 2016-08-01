'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectActionCreators from '../../actions/project-action-creators';
import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';
import DialogsActionCreators from '../../actions/dialogs-action-creators';

import PropertiesImage from './properties-image';

class Properties extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };

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
    const project = this.props.project;
    const projectVersion = project && project.version;
    const state = ProjectStateStore.getProjectState(project);
    const selection = state.selection;
    this.setState({ projectVersion, selection });
  }

  select(data) {
    const project = this.props.project;
    const state = ProjectStateStore.getProjectState(project);
    state.activeContent = data;
    state.selection = data;
    ProjectActionCreators.stateRefresh(project);
  }

  renderProject(project) {
    return (
      <div>
        <base.PropertiesTitle icon={<base.icons.tabs.Ui/>} text={'Project'} />
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
            <tr>
              <td><base.PropertiesLabel text={'Default window'}/></td>
              <td><base.PropertiesValue value={'TODO'}/></td>
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
        ProjectActionCreators.deleteComponent(project, component);
      } catch(err) {
        DialogsActionCreators.error(err);
      }
    };

    return (
      <div>
        <base.PropertiesTitle icon={<base.icons.Component/>} text={component.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><base.PropertiesLabel text={'Id'} /></td>
              <td><base.PropertiesValue value={component.id} /></td>
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
        ProjectActionCreators.deleteWindow(project, window);
      } catch(err) {
        DialogsActionCreators.error(err);
      }
    };

    return (
      <div>
        <base.PropertiesTitle icon={<base.icons.UiImage/>} text={window.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><base.PropertiesLabel text={'Id'} /></td>
              <td><base.PropertiesEditor project={project} object={window} property={'id'} type={'s'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Width'} /></td>
              <td><base.PropertiesEditor project={project} object={window} property={'width'} type={'i'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Height'} /></td>
              <td><base.PropertiesEditor project={project} object={window} property={'height'} type={'i'} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderControl(project, window, control) {
    const onDelete = () => {
      try {
        this.select({ type: 'window', uid: window.uid });
        ProjectActionCreators.deleteControl(project, window, control);
      } catch(err) {
        DialogsActionCreators.error(err);
      }
    };

    return (
      <div>
        <base.PropertiesTitle icon={<base.icons.UiImage/>} text={control.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><base.PropertiesLabel text={'Id'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'id'} type={'s'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'X'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'x'} type={'n'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Y'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'y'} type={'n'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Width'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'width'} type={'i'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Height'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'height'} type={'i'} /></td>
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
          return this.renderControl(project, window, control);
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