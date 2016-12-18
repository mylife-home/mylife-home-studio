'use strict';

import React from 'react';
import icons from '../icons';

import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesEditor from '../properties/properties-editor';

import ImageSelectorContainer from '../../containers/ui-project-tab/image-selector-container';
import PropertiesControlActionContainer from '../../containers/ui-project-tab/properties-control-action-container';
import PropertiesControlTextContext from './properties-control-text-context';
import PropertiesControlDisplayMapping from './properties-control-display-mapping';
import ComponentAttributeSelectorContainer from '../../containers/ui-project-tab/component-attribute-selector-container';

import AppDispatcher from '../../compat/dispatcher';
import {
  projectDeleteControl, projectControlChangeTextFormat, projectControlChangeId, projectMoveControl, projectResizeControl,
  projectControlChangeImage, projectControlChangeDisplayComponent,
  projectControlAddTextContext, projectControlDeleteTextContext, projectControlChangeTextContextId, projectControlChangeTextContextComponent,
  projectControlChangeDisplayMappingImage, projectControlChangeDisplayMappingValue, projectControlChangeDisplayMappingMin, projectControlChangeDisplayMappingMax, projectControlAddDisplayMapping, projectControlDeleteDisplayMapping
} from '../../actions/index';

class PropertiesControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  handleComponentChange(component, attribute) {
    const { project, window, control } = this.props;
    AppDispatcher.dispatch(projectControlChangeDisplayComponent(project, window, control, component, attribute));
  }

  renderDisplay(project, window, control) {
    return [
      (<tr key="Default image">
        <td><PropertiesLabel text={'Default image'} /></td>
        <td><ImageSelectorContainer project={project.uid} image={control.display.defaultResource} onImageChange={(img) => AppDispatcher.dispatch(projectControlChangeImage(project.uid, window.uid, control.uid, img))} /></td>
      </tr>),
      (<tr key="Component/Attribute">
        <td><PropertiesLabel text={'Component/Attribute'} /></td>
        <td><ComponentAttributeSelectorContainer
          project={project.uid}
          component={control.display.component}
          attribute={control.display.attribute}
          nullable={true}
          onChange={(comp, attr) => this.handleComponentChange(comp, attr)} /></td>
      </tr>),
      (<tr key="Mapping">
        <td><PropertiesLabel text={'Mapping'} /></td>
        <td>
          <PropertiesControlDisplayMapping project={project}
                                           control={control}
                                           onNew={(newItem) => AppDispatcher.dispatch(projectControlAddDisplayMapping(project, window, control, newItem))}
                                           onDelete={(item) => AppDispatcher.dispatch(projectControlDeleteDisplayMapping(project, window, control, item))}
                                           onImageChange={(item, img) => AppDispatcher.dispatch(projectControlChangeDisplayMappingImage(project, window, control, item, img))}
                                           onValueChange={(item, value) => AppDispatcher.dispatch(projectControlChangeDisplayMappingValue(project, window, control, item, value))}
                                           onMinChange={(item, value) => AppDispatcher.dispatch(projectControlChangeDisplayMappingMin(project, window, control, item, value))}
                                           onMaxChange={(item, value) => AppDispatcher.dispatch(projectControlChangeDisplayMappingMax(project, window, control, item, value))} />
        </td>
      </tr>)
    ];
  }

  renderText(project, window, control) {
    return [
      (<tr key="Format">
        <td><PropertiesLabel text={'Format (function body with context items as args)'} /></td>
        <td><PropertiesEditor id={`${control.uid}_text_format`} value={control.text.format} onChange={(value) => AppDispatcher.dispatch(projectControlChangeTextFormat(project, window, control, value))} type={'s'} /></td>
      </tr>),
      (<tr key="Context">
        <td><PropertiesLabel text={'Context'} /></td>
        <td>
          <PropertiesControlTextContext project={project}
                                        control={control}
                                        onNew={(newItem) => AppDispatcher.dispatch(projectControlAddTextContext(project, window, control, newItem))}
                                        onDelete={(item) => AppDispatcher.dispatch(projectControlDeleteTextContext(project, window, control, item))}
                                        onIdChange={(item, newId) => AppDispatcher.dispatch(projectControlChangeTextContextId(project, window, control, item, newId))}
                                        onComponentChange={(item, component, attribute) => AppDispatcher.dispatch(projectControlChangeTextContextComponent(project, window, control, item, component, attribute))} />
        </td>
      </tr>)
    ];
  }

  render() {
    const { project, window, control } = this.props;

    const onDelete = () => {
      AppDispatcher.dispatch(projectDeleteControl(project.uid, window.uid, control.uid));
    };

    return (
      <div>
        <PropertiesTitle icon={control.text ? <icons.UiText/> : <icons.UiImage/>} text={control.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><PropertiesLabel text={'Id'} /></td>
              <td><PropertiesEditor id={`${control.uid}_id`} value={control.id} onChange={(value) => AppDispatcher.dispatch(projectControlChangeId(project.uid, window.uid, control.uid, value))} type={'s'} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'X'} /></td>
              <td><PropertiesEditor id={`${control.uid}_x`} value={control.x} onChange={(value) => AppDispatcher.dispatch(projectMoveControl(project.uid, window.uid, control.uid, { x: value, y: control.y }))} type={'n'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Y'} /></td>
              <td><PropertiesEditor id={`${control.uid}_y`} value={control.y} onChange={(value) => AppDispatcher.dispatch(projectMoveControl(project.uid, window.uid, control.uid, { x: control.x, y: value }))} type={'n'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Width'} /></td>
              <td><PropertiesEditor id={`${control.uid}_width`} value={control.width} onChange={(value) => AppDispatcher.dispatch(projectResizeControl(project.uid, window.uid, control.uid, { height: control.height, width: value }))} type={'i'} useRealType={true} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Height'} /></td>
              <td><PropertiesEditor id={`${control.uid}_height`} value={control.height} onChange={(value) => AppDispatcher.dispatch(projectResizeControl(project.uid, window.uid, control.uid, { height: value, width: control.width }))} type={'i'} useRealType={true} /></td>
            </tr>
            {control.text ? this.renderText(project, window, control) : this.renderDisplay(project, window, control)}
            <tr>
              <td><PropertiesLabel text={'Primary action'} /></td>
              <td>
                <PropertiesControlActionContainer project={project.uid}
                                                  window={window.uid}
                                                  control={control.uid}
                                                  action={'primaryAction'} />
              </td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Secondary action'} /></td>
              <td>
                <PropertiesControlActionContainer project={project.uid}
                                                  window={window.uid}
                                                  control={control.uid}
                                                  action={'secondaryAction'} />
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
