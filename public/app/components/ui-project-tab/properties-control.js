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

  renderDisplay(project, control) {
    return [
      (<tr key="Default image">
        <td><base.PropertiesLabel text={'Default image'} /></td>
        <td><base.PropertiesValue value={'TODO'} /></td>
      </tr>),
      (<tr key="Mapping">
        <td><base.PropertiesLabel text={'Mapping'} /></td>
        <td><base.PropertiesValue value={'TODO'} /></td>
      </tr>)
    ];
  }

  renderText(project, control) {
    return [
      (<tr key="Format">
        <td><base.PropertiesLabel text={'Format'} /></td>
        <td><base.PropertiesEditor project={project} object={control.text} property={'format'} type={'s'} /></td>
      </tr>),
      (<tr key="Context">
        <td><base.PropertiesLabel text={'Context'} /></td>
        <td><base.PropertiesValue value={'TODO'} /></td>
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
            {control.text ? this.renderText(project, control) : this.renderDisplay(project, control)}
            <tr>
              <td><base.PropertiesLabel text={'Prinary action'} /></td>
              <td><base.PropertiesValue value={'TODO'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Secondary action'} /></td>
              <td><base.PropertiesValue value={'TODO'} /></td>
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