'use strict';

import React from 'react';
import commonStyles from './canvas-styles';

import DataImage from './data-image';

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

    return (
      <div style={styles.container}>
        <DataImage image={image} style={styles.imageContent} />
      </div>
    );
  }
}

CanvasImage.propTypes = {
  image: React.PropTypes.object.isRequired,
};

export default CanvasImage;