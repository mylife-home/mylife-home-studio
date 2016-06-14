'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import Toolbar from './toolbar';

class Explorer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const project = this.props.project;

    return (
      <div>
        EXPLORER
        <Toolbar project={project} />
      </div>
    );
  }
}

Explorer.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Explorer;