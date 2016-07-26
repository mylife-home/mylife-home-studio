'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';
import commonStyles from './canvas-styles';

const styles = Object.assign({
}, commonStyles);

class CanvasWindow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (<div>window</div>);
  }
}

CanvasWindow.propTypes = {
  window: React.PropTypes.object.isRequired,
};

export default CanvasWindow;