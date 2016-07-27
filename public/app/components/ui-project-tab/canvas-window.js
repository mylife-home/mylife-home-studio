'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import rr from 'react-resizable';
import base from '../base/index';
import commonStyles from './canvas-styles';

const styles = Object.assign({
}, commonStyles);

class CanvasWindow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { window } = this.props;

    return (
      <div style={styles.container}>
        <rr.ResizableBox width={window.width} height={window.height}>
          window
        </rr.ResizableBox>
      </div>
    );
  }
}

CanvasWindow.propTypes = {
  window: React.PropTypes.object.isRequired,
};

export default CanvasWindow;