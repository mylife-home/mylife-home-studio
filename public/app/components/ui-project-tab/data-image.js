'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class DataImage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { data, ...other } = this.props;

    if(!data) {
      return (<img {...other} />);
    }

    return (<img src={`data:image/png;base64,${data}`} {...other} />);
  }
}

DataImage.propTypes = {
  data: React.PropTypes.string,
};

export default DataImage;