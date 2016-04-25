'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';

import ProjectActionCreators from '../../actions/project-action-creators';

class VPanelProjectTab extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const project = this.props.project;

    return (
      <div>
        <h2>{project.name}</h2>
        <p>
          <mui.FlatButton onClick={() => ProjectActionCreators.close(project)}>Close</mui.FlatButton>
          TODO
        </p>
      </div>
    );
  }
}

VPanelProjectTab.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default VPanelProjectTab;
