'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import Facade from '../../services/facade';

import ProjectActionCreators from '../../actions/project-action-creators';
import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';
import DialogsActionCreators from '../../actions/dialogs-action-creators';

import PropertiesImageSelector from './properties-image-selector';
import PropertiesControlAction from './properties-control-action';
import PropertiesControlTextContext from './properties-control-text-context';
import PropertiesControlDisplayMapping from './properties-control-display-mapping';
import PropertiesComponentAttributeSelector from './properties-component-attribute-selector';

const styles = {
  fileInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

class PropertiesControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };

    const image = this.props.image;
    this.calculateSize(image);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ size : null });

    const image = nextProps.image;
    this.calculateSize(image);
  }

  calculateSize(image) {
    if(image && image.content) {
      base.utils.imageSize(image.content, (err, size) => {
        this.setState({ size });
      });
    }
  }

  selectWindow() {
    const { project, window } = this.props;
    const state = ProjectStateStore.getProjectState(project);
    state.selection = { type: 'window', uid: window.uid };
    ProjectActionCreators.stateRefresh(project);
  }

  handleComponentChange(component, attribute) {
    const { project, control } = this.props;

    control.display.component = component;
    control.display.attribute = attribute;
    control.display.map = [];
    Facade.projects.dirtify(project);
  }

  renderDisplay(project, control) {
    return [
      (<tr key="Default image">
        <td><base.PropertiesLabel text={'Default image'} /></td>
        <td><PropertiesImageSelector project={project} object={control.display} property={'defaultResource'} /></td>
      </tr>),
      (<tr key="Component/Attribute">
        <td><base.PropertiesLabel text={'Component/Attribute'} /></td>
        <td><PropertiesComponentAttributeSelector
          project={project}
          component={control.display.component}
          attribute={control.display.attribute}
          nullable={true}
          onChange={this.handleComponentChange.bind(this)} /></td>
      </tr>),
      (<tr key="Mapping">
        <td><base.PropertiesLabel text={'Mapping'} /></td>
        <td><PropertiesControlDisplayMapping project={project} display={control.display} /></td>
      </tr>)
    ];
  }

  renderText(project, control) {
    return [
      (<tr key="Format">
        <td><base.PropertiesLabel text={'Format (function body with context items as args)'} /></td>
        <td><base.PropertiesEditor project={project} object={control.text} property={'format'} type={'s'} /></td>
      </tr>),
      (<tr key="Context">
        <td><base.PropertiesLabel text={'Context'} /></td>
        <td><PropertiesControlTextContext project={project} text={control.text} /></td>
      </tr>)
    ];
  }

  render() {
    const { project, window, control } = this.props;

    const onDelete = () => {
      try {
        this.selectWindow();
        ProjectActionCreators.deleteControl(project, window, control);
      } catch(err) {
        DialogsActionCreators.error(err);
      }
    };

    return (
      <div>
        <base.PropertiesTitle icon={control.text ? <base.icons.UiText/> : <base.icons.UiImage/>} text={control.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><base.PropertiesLabel text={'Id'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'id'} type={'s'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'X'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'x'} type={'n'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Y'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'y'} type={'n'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Width'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'width'} type={'i'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Height'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'height'} type={'i'} useRealType={true} /></td>
            </tr>
            {control.text ? this.renderText(project, control) : this.renderDisplay(project, control)}
            <tr>
              <td><base.PropertiesLabel text={'Primary action'} /></td>
              <td><PropertiesControlAction project={project} object={control} property={'primaryAction'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Secondary action'} /></td>
              <td><PropertiesControlAction project={project} object={control} property={'secondaryAction'} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

PropertiesControl.propTypes = {
  project: React.PropTypes.object.isRequired,
  window: React.PropTypes.object.isRequired,
  control: React.PropTypes.object.isRequired
};

export default PropertiesControl;
