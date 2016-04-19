'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

const styles = {
  titleContainer : {
    textAlign    : 'center',
    marginLeft   : '25px',
    marginRight  : '25px',
    marginTop    : '10px',
    marginBottom : '10px',
  },
  titleItem: {
    verticalAlign: 'middle',
    lineHeight: '60px',
    marginTop: 0
  },
  titleLeft: {
    float: 'left',
  },
  titleRight: {
    float: 'right',
  },
  titleMain: {
  }
};

class DetailsTitle extends React.Component {

  constructor(props, context) {
    super(props);
    this.state = {
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }

  renderLeft() {
    const val = this.props.left;
    if(!val) {
      return null;
    }
    const style = Object.assign({}, styles.titleItem, styles.titleLeft);
    return (<h3 style={style}>{val}</h3>);
  }

  renderRight() {
    const val = this.props.right;
    if(!val) {
      return null;
    }
    const style = Object.assign({}, styles.titleItem, styles.titleRight);
    return (<h3 style={style}>{val}</h3>);
  }

  render() {
    const additionalStyle = {
      fontFamily: this.state.muiTheme.fontFamily,
      color: this.state.muiTheme.palette.primaryColor,
    };

    return (
      <div>
        <div style={Object.assign({}, styles.titleContainer, additionalStyle)}>
          {this.renderLeft()}
          {this.renderRight()}
          <h2 style={Object.assign({}, styles.titleItem, styles.titleMain)}>{this.props.center}</h2>
        </div>
        <mui.Divider />
      </div>
    );
  }
}

DetailsTitle.propTypes = {
  left:   React.PropTypes.node,
  right:  React.PropTypes.node,
  center: React.PropTypes.node.isRequired,
  muiTheme: React.PropTypes.object
};

DetailsTitle.childContextTypes = {
  muiTheme: React.PropTypes.object
};

DetailsTitle.contextTypes = {
  muiTheme: React.PropTypes.object
};

export default DetailsTitle;