'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from '../base/index';
import icons from '../icons';
import { imageSize } from '../../utils/index';

import PropertiesLabel from '../properties/properties-label';
import PropertiesTitle from '../properties/properties-title';
import PropertiesValue from '../properties/properties-value';

import AppDispatcher from '../../dispatcher/app-dispatcher';

import {
  dialogError,
  projectStateSelectAndActiveContent, projectChangeImage, projectDeleteImage
} from '../../actions/index';

class PropertiesImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };

    const { image } = this.props;
    this.calculateSize(image);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ size : null });

    const image = nextProps.image;
    this.calculateSize(image);
  }

  calculateSize(image) {
    if(image && image.content) {
      imageSize(image.content, (err, size) => {
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
    e.stopPropagation();
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
        <PropertiesTitle icon={<icons.UiImage/>} text={image.id} onDelete={onDelete} />
        {/* details */}
        <table>
          <tbody>
            <tr>
              <td><PropertiesLabel text={'Id'} /></td>
              <td><base.PropertiesEditor project={project} object={image} property={'id'} type={'s'} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Width'} /></td>
              <td><PropertiesValue value={width} /></td>
            </tr>
            <tr>
              <td><PropertiesLabel text={'Height'} /></td>
              <td><PropertiesValue value={height} /></td>
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
          style={{display : 'none'}}
          onChange={this.handleOpenImageFile.bind(this)}/>
      </div>
    );
  }
}

PropertiesImage.propTypes = {
  project: React.PropTypes.object.isRequired,
  image: React.PropTypes.object.isRequired
};

export default PropertiesImage;