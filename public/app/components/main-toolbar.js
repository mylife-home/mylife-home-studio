'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from './base/index';

import DialogsActionCreators from '../actions/dialogs-action-creators';

import OnlineStore from '../stores/online-store';

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

  handleOpenFileVPanelProject(e) {
    return this.loadJsonFile(e, (data) => {
      console.log('handleOpenFileVPanelProject', data);
    });
  }

  handleOpenFileUiProject(e) {
    return this.loadJsonFile(e, (data) => {
      console.log('handleOpenFileUiProject', data);
    });
  }

  openFileVPanelProjectDialog() {
    this.refs.openFileVPanelProject.click();
  }

  openFileUiProjectDialog() {
    this.refs.openFileUiProject.click();
  }

  openOnlineVPanelProjectDialog() {
    const list = OnlineStore.getResourceNames('project.vpanel.');
    console.log('openOnlineVPanelProjectDialog', list);
  }

  openOnlineUiProjectDialog() {
    const list = OnlineStore.getResourceNames('project.ui.');
    console.log('openOnlineUiProjectDialog', list);
  }

  loadJsonFile(e, cb) {
    const file = e.target.files[0];
    e.target.value = '';

    const reader = new FileReader();

    reader.onloadend = () => {
      const err = reader.error;
      if(err) { return DialogsActionCreators.error(err); }
      const content = reader.result;
      let data;
      try {
        data = JSON.parse(content);
      } catch(err) {
        return DialogsActionCreators.error(err);
      }
      return cb(data);
    };

    reader.readAsText(file);
  }

  render() {
    const iconStyle = Object.assign({}, styles.icon, { fill: this.state.muiTheme.toolbar.iconColor});
    return (
    <mui.Toolbar>
      <mui.ToolbarGroup float="left">
        <base.icons.tabs.VPanel style={iconStyle} />
        <mui.ToolbarTitle text="vpanel" />

        <mui.IconButton tooltip="new" style={styles.button}>
          <base.icons.actions.New />
        </mui.IconButton>
        <mui.IconButton tooltip="open online"
                        style={styles.button}
                        onClick={this.openOnlineVPanelProjectDialog.bind(this)}>
          <base.icons.actions.OpenOnline />
        </mui.IconButton>
        <mui.IconButton tooltip="open from file"
                        style={styles.button}
                        onClick={this.openFileVPanelProjectDialog.bind(this)}>
          <base.icons.actions.OpenFile />
        </mui.IconButton>

        <mui.ToolbarSeparator />

        <base.icons.tabs.Ui style={iconStyle} />
        <mui.ToolbarTitle text="ui"/>

        <mui.IconButton tooltip="new" style={styles.button}>
          <base.icons.actions.New />
        </mui.IconButton>
        <mui.IconButton tooltip="open online"
                        style={styles.button}
                        onClick={this.openOnlineUiProjectDialog.bind(this)}>
          <base.icons.actions.OpenOnline />
        </mui.IconButton>
        <mui.IconButton tooltip="open from file"
                        style={styles.button}
                        onClick={this.openFileUiProjectDialog.bind(this)}>
          <base.icons.actions.OpenFile />
        </mui.IconButton>

        <mui.ToolbarSeparator />

        <mui.IconButton tooltip="save all" style={styles.button}>
          <base.icons.actions.SaveAll />
        </mui.IconButton>
        <mui.IconButton tooltip="save" style={styles.button}>
          <base.icons.actions.Save />
        </mui.IconButton>
        <mui.IconButton tooltip="save as" style={styles.button}>
          <base.icons.actions.SaveAs />
        </mui.IconButton>
      </mui.ToolbarGroup>

      <input
        ref="openFileVPanelProject"
        type="file"
        style={{"display" : "none"}}
        onChange={this.handleOpenFileVPanelProject.bind(this)}/>

      <input
        ref="openFileUiProject"
        type="file"
        style={{"display" : "none"}}
        onChange={this.handleOpenFileUiProject.bind(this)}/>
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
