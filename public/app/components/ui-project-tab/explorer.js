'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

class Explorer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        EXPLORER
      </div>
    );
  }
}

Explorer.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Explorer;