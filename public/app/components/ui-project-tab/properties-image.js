'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectStore from '../../stores/project-store';
import AppDispatcher from '../../dispatcher/app-dispatcher';

import {
  dialogError,
  projectStateSelectAndActiveContent, projectChangeImage, projectDeleteImage
} from '../../actions/index';

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
    const { project } = this.props;
    AppDispatcher.dispatch(projectStateSelectAndActiveContent(project, null, null));
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
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }

      let data = reader.result;
      const marker = 'base64,';
      const start = data.indexOf(marker) + marker.length;
      data = data.substring(start);

      const { project, image } = this.props;
      projectChangeImage(project, image, data);
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
        projectDeleteImage(project, image);
      } catch(err) {
        AppDispatcher.dispatch(dialogError(err));
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