'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';
import commonStyles from './canvas-styles';

const styles = Object.assign({
  imageContent : {
    position : 'absolute',
    top      : 0,
    left     : 0,
    right    : 0,
    bottom   : 0,
    margin   : 'auto'
  }
}, commonStyles);

class CanvasImage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const image = this.props.image;
    const url = image.content ? `data:image/png;base64,${image.content}` : null;

    return (
      <div style={styles.container}>
        <img src={url} style={styles.imageContent} />
      </div>
    );
  }
}

CanvasImage.propTypes = {
  image: React.PropTypes.object.isRequired,
};

export default CanvasImage;