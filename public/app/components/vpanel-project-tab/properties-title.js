'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

function getStyles(props, state) {
  const { baseTheme } = state.muiTheme;

  return {
    titleContainer : {
      textAlign    : 'center',
      background   : baseTheme.palette.primary3Color,
      color        : baseTheme.palette.textColor,
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

class PropertiesTitle extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  render() {
    const { icon, text, onDelete } = this.props;
    const styles = getStyles(this.props, this.state);

    return (
      <div style={styles.titleContainer}>
        <div style={Object.assign({}, styles.titleItem, styles.titleLeft)}>
          {icon}
        </div>
        {(() => {
          if(!onDelete) { return; }
          return (
            <mui.IconButton onClick={onDelete} style={Object.assign({}, styles.titleItem, styles.titleRight)}>
              <base.icons.actions.Close/>
            </mui.IconButton>);
        })()}
        <div style={Object.assign({}, styles.titleItem, styles.titleMain)}>
          {text}
        </div>
      </div>
    );
  }

}

PropertiesTitle.propTypes = {
  icon     : React.PropTypes.node.isRequired,
  text     : React.PropTypes.string.isRequired,
  onDelete : React.PropTypes.func,
};

PropertiesTitle.contextTypes = {
  muiTheme: React.PropTypes.object
};

PropertiesTitle.childContextTypes = {
  muiTheme: React.PropTypes.object
};

export default PropertiesTitle;