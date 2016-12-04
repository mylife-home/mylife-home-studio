'use strict';

import React from 'react';
import * as mui from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';

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
    marginTop: 0,
    marginBottom : 0,
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

function renderLeft(val) {
  if(!val) {
    return null;
  }
  const style = Object.assign({}, styles.titleItem, styles.titleLeft);
  return (<h3 style={style}>{val}</h3>);
}

function renderRight(val) {
  if(!val) {
    return null;
  }
  const style = Object.assign({}, styles.titleItem, styles.titleRight);
  return (<h3 style={style}>{val}</h3>);
}

const DetailsTitle = ({ muiTheme, left, right, center }) => {
  const additionalStyle = {
    fontFamily: muiTheme.fontFamily,
    color: muiTheme.palette.primaryColor,
  };

  return (
    <div>
      <div style={Object.assign({}, styles.titleContainer, additionalStyle)}>
        {renderLeft(left)}
        {renderRight(right)}
        <h2 style={Object.assign({}, styles.titleItem, styles.titleMain)}>{center}</h2>
      </div>
      <mui.Divider />
    </div>
  );
};

DetailsTitle.propTypes = {
  left:   React.PropTypes.node,
  right:  React.PropTypes.node,
  center: React.PropTypes.node.isRequired
};

export default muiThemeable()(DetailsTitle);
