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

  render() {
    const project = this.props.project;
    const image = this.props.image;
    const size = this.state.size;
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
          </tbody>
        </table>
      </div>
    );
  }
}

PropertiesImage.propTypes = {
  project: React.PropTypes.object.isRequired,
  image: React.PropTypes.object.isRequired
};

export default PropertiesImage;