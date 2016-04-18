'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

const styles = {
  titleContainer: {
    textAlign: 'center',
    margin: '10px'
  },
  titleLeft: {
    float: 'left'
  },
  titleRight: {
    float: 'right'
  },
  titleMain: {

  }
};

class DetailsTitle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderLeft() {
    const val = this.props.left;
    if(!val) {
      return null;
    }
    return (<h3 style={styles.titleLeft}>{val}</h3>);
  }

  renderRight() {
    const val = this.props.right;
    if(!val) {
      return null;
    }
    return (<h3 style={styles.titleRight}>{val}</h3>);
  }

  render() {
    return (
      <div style={styles.titleContainer}>
        {this.renderLeft()}
        {this.renderRight()}
        <h2>{this.props.center}</h2>
      </div>
    );
  }
}

DetailsTitle.propTypes = {
  left:   React.PropTypes.node,
  right:  React.PropTypes.node,
  center: React.PropTypes.node.isRequired,
};

export default DetailsTitle;