'use strict';

import React from 'react';
import icons from '../icons';

import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesEditor from '../properties/properties-editor';

import PropertiesImageSelector from './properties-image-selector';
import PropertiesControlAction from './properties-control-action';
import PropertiesControlTextContext from './properties-control-text-context';
import PropertiesControlDisplayMapping from './properties-control-display-mapping';
import PropertiesComponentAttributeSelector from './properties-component-attribute-selector';

import AppDispatcher from '../../compat/dispatcher';
import {
  projectDeleteControl, projectControlChangeTextFormat, projectControlChangeId, projectMoveControl, projectResizeControl,
  projectControlChangeAction, projectControlChangeImage, projectControlChangeDisplayComponent
} from '../../actions/index';

class PropertiesControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  handleComponentChange(component, attribute) {
    const { project, window, control } = this.props;
    projectControlChangeDisplayComponent(project, window, control, component, attribute);
  }

  renderDisplay(project, window, control) {
    return [
      (<tr key="Default image">
        <td><PropertiesLabel text={'Default image'} /></td>
        <td><PropertiesImageSelector project={project} image={control.display.defaultResource} onImageChange={(img) => projectControlChangeImage(project, window, control, img)} /></td>
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
        <td><PropertiesControlDisplayMapping project={project} window={window} control={control} /></td>
      </tr>)
    ];
  }

  renderText(project, window, control) {
    return [
      (<tr key="Format">
        <td><PropertiesLabel text={'Format (function body with context items as args)'} /></td>
        <td><PropertiesEditor id={`${control.uid}_text_format`} value={control.text.format} onChange={(value) => projectControlChangeTextFormat(project, window, control, value)} type={'s'} /></td>
      </tr>),
      (<tr key="Context">
        <td><PropertiesLabel text={'Context'} /></td>
        <td><PropertiesControlTextContext project={project} window={window} control={control} /></td>
      </tr>)
    ];
  }

  render() {
    const { project, window, control } = this.props;

    const onDelete = () => {
      AppDispatcher.dispatch(projectDeleteControl(project, window, control));
    };

    return (
      <div>
        <PropertiesTitle icon={control.text ? <icons.UiText/> : <icons.UiImage/>} text={control.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><PropertiesLabel text={'Id'} /></td>
              <td><PropertiesEditor id={`${control.uid}_id`} value={control.id} onChange={(value) => projectControlChangeId(project, window, control, value)} type={'s'} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'X'} /></td>
              <td><PropertiesEditor id={`${control.uid}_x`} value={control.x} onChange={(value) => projectMoveControl(project, window, control, { x: value, y: control.y })} type={'n'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Y'} /></td>
              <td><PropertiesEditor id={`${control.uid}_y`} value={control.y} onChange={(value) => projectMoveControl(project, window, control, { x: control.x, y: value })} type={'n'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Width'} /></td>
              <td><PropertiesEditor id={`${control.uid}_width`} value={control.width} onChange={(value) => projectResizeControl(project, window, control, { height: control.height, width: value })} type={'i'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Height'} /></td>
              <td><PropertiesEditor id={`${control.uid}_height`} value={control.height} onChange={(value) => projectResizeControl(project, window, control, { height: value, width: control.width })} type={'i'} useRealType={true} /></td>
            </tr>
            {control.text ? this.renderText(project, window, control) : this.renderDisplay(project, window, control)}
            <tr>
              <td><PropertiesLabel text={'Primary action'} /></td>
              <td>
                <PropertiesControlAction project={project}
                                         action={control.primaryAction}
                                         onActionChange={(newAction) => projectControlChangeAction(project, window, control, 'primaryAction', newAction)} />
              </td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Secondary action'} /></td>
              <td>
                <PropertiesControlAction project={project}
                                         action={control.secondaryAction}
                                         onActionChange={(newAction) => projectControlChangeAction(project, window, control, 'secondaryAction', newAction)} />
              </td>
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
