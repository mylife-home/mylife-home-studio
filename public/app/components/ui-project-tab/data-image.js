'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';

class DataImage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { image, ...other } = this.props;
    const url = (image && image.content) ? `data:;base64,${image.content}` : null;

    return (
      <img {...other} src={url} />
    );
  }
}

DataImage.propTypes = {
  image: React.PropTypes.object.isRequired,
};

export default DataImage;