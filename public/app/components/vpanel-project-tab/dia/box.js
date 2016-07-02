'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class Box extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      children,
      ...other,
    } = this.props;

    return (
      <div {...other} >
        {children}
      </div>
    );
  }
}

Box.propTypes = {
  children: React.PropTypes.node,
};

export default Box;