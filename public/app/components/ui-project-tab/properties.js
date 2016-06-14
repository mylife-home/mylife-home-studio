'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

class Properties extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        PROPERTIES
      </div>
    );
  }
}

Properties.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Properties;