'use strict';

import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

const styles = {
  text: {
    padding: '10px',
    position: 'absolute',
    lineHeight: '50px',
    overflowY: 'auto',
    width: '100%',
    wordWrap: 'break-word',
  }
};

const DetailsContainer = ({ muiTheme, children, ...props }) => {

  const additionalStyle = {
    fontFamily: muiTheme.fontFamily,
    color: muiTheme.palette.primaryColor,
  };

  return (
    <div style={Object.assign({}, styles.text, additionalStyle)} {...props}>
      {children}
    </div>
  );
};

DetailsContainer.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export default muiThemeable()(DetailsContainer);