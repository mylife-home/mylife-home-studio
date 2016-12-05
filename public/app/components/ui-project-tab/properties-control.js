'use strict';

import React from 'react';
import base from '../base/index';
import icons from '../icons';

import Facade from '../../services/facade';

import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';

import PropertiesImageSelector from './properties-image-selector';
import PropertiesControlAction from './properties-control-action';
import PropertiesControlTextContext from './properties-control-text-context';
import PropertiesControlDisplayMapping from './properties-control-display-mapping';
import PropertiesComponentAttributeSelector from './properties-component-attribute-selector';

import AppDispatcher from '../../compat/dispatcher';
import { projectStateSelect, projectDeleteControl, dialogError } from '../../actions/index';

class PropertiesControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  selectWindow() {
    const { project, window } = this.props;
    AppDispatcher.dispatch(projectStateSelect(project, { type: 'window', uid: window.uid }));
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
        <td><PropertiesLabel text={'Default image'} /></td>
        <td><PropertiesImageSelector project={project} object={control.display} property={'defaultResource'} /></td>
      </tr>),
      (<tr key="Component/Attribute">
        <td><PropertiesLabel text={'Component/Attribute'} /></td>
        <td><PropertiesComponentAttributeSelector
          project={project}
          component={control.display.component}
          attribute={control.display.attribute}
          nullable={true}
          onChange={this.handleComponentChange.bind(this)} /></td>
      </tr>),
      (<tr key="Mapping">
        <td><PropertiesLabel text={'Mapping'} /></td>
        <td><PropertiesControlDisplayMapping project={project} display={control.display} /></td>
      </tr>)
    ];
  }

  renderText(project, control) {
    return [
      (<tr key="Format">
        <td><PropertiesLabel text={'Format (function body with context items as args)'} /></td>
        <td><base.PropertiesEditor project={project} object={control.text} property={'format'} type={'s'} /></td>
      </tr>),
      (<tr key="Context">
        <td><PropertiesLabel text={'Context'} /></td>
        <td><PropertiesControlTextContext project={project} text={control.text} /></td>
      </tr>)
    ];
  }

  render() {
    const { project, window, control } = this.props;

    const onDelete = () => {
      try {
        this.selectWindow();
        projectDeleteControl(project, window, control);
      } catch(err) {
        AppDispatcher.dispatch(dialogError(err));
      }
    };

    return (
      <div>
        <PropertiesTitle icon={control.text ? <icons.UiText/> : <icons.UiImage/>} text={control.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><PropertiesLabel text={'Id'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'id'} type={'s'} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'X'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'x'} type={'n'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Y'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'y'} type={'n'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Width'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'width'} type={'i'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Height'} /></td>
              <td><base.PropertiesEditor project={project} object={control} property={'height'} type={'i'} useRealType={true} /></td>
            </tr>
            {control.text ? this.renderText(project, control) : this.renderDisplay(project, control)}
            <tr>
              <td><PropertiesLabel text={'Primary action'} /></td>
              <td><PropertiesControlAction project={project} object={control} property={'primaryAction'} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Secondary action'} /></td>
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
