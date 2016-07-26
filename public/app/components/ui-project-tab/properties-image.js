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