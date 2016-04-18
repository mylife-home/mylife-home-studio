'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from './base/index';

const styles = {
  icon: {
    margin: 16,
  },
  button: {
    height: '56px',
    width: '56px'
  }
};

class MainToolbar extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      muiTheme: context.muiTheme || muiStyles.getMuiTheme()
    };
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      muiTheme: nextContext.muiTheme || this.state.muiTheme,
    });
  }

  render() {
    const iconStyle = Object.assign({}, styles.icon, { fill: this.state.muiTheme.toolbar.iconColor});
    return (
    <mui.Toolbar>
      <mui.ToolbarGroup float="left">
        <base.icons.tabs.VPanel style={iconStyle} />
        <mui.ToolbarTitle text="vpanel" />

        <mui.IconButton tooltip="new" style={styles.button}>
          <base.icons.toolbar.New />
        </mui.IconButton>
        <mui.IconButton tooltip="open online" style={styles.button}>
          <base.icons.toolbar.OpenOnline />
        </mui.IconButton>
        <mui.IconButton tooltip="open from file" style={styles.button}>
          <base.icons.toolbar.OpenFile />
        </mui.IconButton>

        <mui.ToolbarSeparator />

        <base.icons.tabs.Ui style={iconStyle} />
        <mui.ToolbarTitle text="ui"/>

        <mui.IconButton tooltip="new" style={styles.button}>
          <base.icons.toolbar.New />
        </mui.IconButton>
        <mui.IconButton tooltip="open online" style={styles.button}>
          <base.icons.toolbar.OpenOnline />
        </mui.IconButton>
        <mui.IconButton tooltip="open from file" style={styles.button}>
          <base.icons.toolbar.OpenFile />
        </mui.IconButton>

        <mui.ToolbarSeparator />

        <mui.IconButton tooltip="save all" style={styles.button}>
          <base.icons.toolbar.SaveAll />
        </mui.IconButton>
        <mui.IconButton tooltip="save" style={styles.button}>
          <base.icons.toolbar.Save />
        </mui.IconButton>
        <mui.IconButton tooltip="save as" style={styles.button}>
          <base.icons.toolbar.SaveAs />
        </mui.IconButton>
      </mui.ToolbarGroup>
    </mui.Toolbar>
  ); }
}


MainToolbar.propTypes = {
  muiTheme: React.PropTypes.object
};

MainToolbar.childContextTypes = {
  muiTheme: React.PropTypes.object
},

MainToolbar.contextTypes = {
  muiTheme: React.PropTypes.object
};

export default MainToolbar;
