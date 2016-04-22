'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from './base/index';

import DialogsActionCreators from '../actions/dialogs-action-creators';
import ResourcesActionCreators from '../actions/resources-action-creators';

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
    this.setState({
      openOnlineVPanelProjectItems: OnlineStore.getResourceNames('project.vpanel.')
    });
  }

  openOnlineUiProjectDialog() {
    this.setState({
      openOnlineUiProjectItems: OnlineStore.getResourceNames('project.ui.')
    });
  }

  handleOpenOnlineVPanelProject(name) {
    this.setState({
      openOnlineVPanelProjectItems: null
    });
    if(!name) { return; }
    this.loadJsonOnline(name, (data) => {
      console.log('handleOpenOnlineVPanelProject', data);
    });
  }

  handleOpenOnlineUiProject(name) {
    this.setState({
      openOnlineUiProjectItems: null
    });
    if(!name) { return; }
    this.loadJsonOnline(name, (data) => {
      console.log('handleOpenOnlineUiProject', data);
    });
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

  loadJsonOnline(resource, cb) {
    function parse(content) {
      let data;
      try {
        data = JSON.parse(content);
      } catch(err) {
        return DialogsActionCreators.error(err);
      }
      return cb(data);
    }

    const entity = OnlineStore.getResourceEntity();
    const cachedContent = entity.cachedResources && entity.cachedResources[resource];
    if(cachedContent) {
      return parse(cachedContent);
    }

    // need to get content .. TODO: Flux pattern to do that ?
    return ResourcesActionCreators.resourceGetQuery(entity.id, resource, parse);
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

        <base.DialogSelect title="Select VPanel Project"
                           open={!!this.state.openOnlineVPanelProjectItems}
                           items={this.state.openOnlineVPanelProjectItems || []}
                           select={this.handleOpenOnlineVPanelProject.bind(this)}
                           cancel={this.handleOpenOnlineVPanelProject.bind(this, null)}/>

        <base.DialogSelect title="Select UI Project"
                           open={!!this.state.openOnlineUiProjectItems}
                           items={this.state.openOnlineUiProjectItems || []}
                           select={this.handleOpenOnlineUiProject.bind(this)}
                           cancel={this.handleOpenOnlineUiProject.bind(this, null)}/>
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
