'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class LinkTarget extends React.Component {

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

LinkTarget.propTypes = {
  children: React.PropTypes.node,
};

export default LinkTarget;