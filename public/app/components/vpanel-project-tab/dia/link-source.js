'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class LinkSource extends React.Component {

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

LinkSource.propTypes = {
  children: React.PropTypes.node,
};

export default LinkSource;