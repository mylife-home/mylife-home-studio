'use strict';

import React from 'react';
import * as mui from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import icons from '../icons';

function getStyles(muiTheme) {

  return {
    titleContainer : {
      textAlign    : 'center',
      background   : muiTheme.palette.primary3Color,
      color        : muiTheme.palette.textColor,
    },
    titleItem: {
      verticalAlign : 'middle',
      marginTop     : 0,
      marginBottom  : 0,
      whiteSpace    : 'nowrap',
      overflow      : 'hidden',
      textOverflow  : 'ellipsis',
      letterSpacing : 0,
      fontSize      : 16,
      fontWeight    : 'normal',
    },
    titleLeft: {
      float   : 'left',
      height  : '48px',
      width   : '48px',
      padding : '12px',
    },
    titleRight: {
      float: 'right',
    },
    titleMain: {
      lineHeight: '48px',
    }
  };
}

const PropertiesTitle = ({ muiTheme, icon, text, onDelete }) => {
  const styles = getStyles(muiTheme);

  return (
    <div style={styles.titleContainer}>
      <div style={Object.assign({}, styles.titleItem, styles.titleLeft)}>
        {icon}
      </div>
      {(() => {
        if(!onDelete) { return; }
        return (
          <mui.IconButton onClick={onDelete} style={Object.assign({}, styles.titleItem, styles.titleRight)}>
            <icons.actions.Close/>
          </mui.IconButton>);
      })()}
      <div style={Object.assign({}, styles.titleItem, styles.titleMain)}>
        {text}
      </div>
    </div>
  );
};

PropertiesTitle.propTypes = {
  icon     : React.PropTypes.node.isRequired,
  text     : React.PropTypes.string.isRequired,
  onDelete : React.PropTypes.func,
};

export default muiThemeable()(PropertiesTitle);
