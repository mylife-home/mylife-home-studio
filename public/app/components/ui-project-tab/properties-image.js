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

class PropertiesImage extends React.Component {

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

  selectProject() {
    const project = this.props.project;
    const state = ProjectStateStore.getProjectState(project);
    state.activeContent = null;
    state.selection = null;
    ProjectActionCreators.stateRefresh(project);
  }

  openImageFileDialog() {
    this.refs.openImageFile.click();
  }

  handleOpenImageFile(e) {
    const file = e.target.files[0];
    e.target.value = '';

    const reader = new FileReader();

    reader.onloadend = () => {
      const err = reader.error;
      if(err) { return DialogsActionCreators.error(err); }

      let data = reader.result;
      const marker = 'base64,';
      const start = data.indexOf(marker) + marker.length;
      data = data.substring(start);

      const image = this.props.image;
      image.content = data;
      ProjectActionCreators.refresh(this.props.project);
    };

    reader.readAsDataURL(file);
  }

  render() {
    const { project, image } = this.props;
    const { size } = this.state;
    const width = ((size && size.width) || 0).toString();
    const height = ((size && size.height) || 0).toString();

    const onDelete = () => {
      try {
        this.selectProject();
        ProjectActionCreators.deleteImage(project, image);
      } catch(err) {
        DialogsActionCreators.error(err);
      }
    };

    return (
      <div>
        <base.PropertiesTitle icon={<base.icons.UiImage/>} text={image.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><base.PropertiesLabel text={'Id'} /></td>
              <td><base.PropertiesEditor project={project} object={image} property={'id'} type={'s'} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Width'} /></td>
              <td><base.PropertiesValue value={width} /></td>
            </tr>
            <tr>
              <td><base.PropertiesLabel text={'Height'} /></td>
              <td><base.PropertiesValue value={height} /></td>
            </tr>
            <tr>
              <td colSpan={2}>
                <mui.RaisedButton label={'Change'} onClick={this.openImageFileDialog.bind(this)} />
              </td>
            </tr>
          </tbody>
        </table>

        <input
          ref="openImageFile"
          type="file"
          style={{"display" : "none"}}
          onChange={base.utils.stopPropagationWrapper(this.handleOpenImageFile.bind(this))}/>
      </div>
    );
  }
}

PropertiesImage.propTypes = {
  project: React.PropTypes.object.isRequired,
  image: React.PropTypes.object.isRequired
};

export default PropertiesImage;