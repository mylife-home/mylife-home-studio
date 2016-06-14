'use strict';

import async from 'async';
import React from 'react';
import * as mui from 'material-ui';
import base from './base/index';

import DialogsActionCreators from '../actions/dialogs-action-creators';
import ResourcesActionCreators from '../actions/resources-action-creators';

import OnlineStore from '../stores/online-store';
import ProjectStore from '../stores/project-store';
import ActiveTabStore from '../stores/active-tab-store';

import Facade from '../services/facade';

const styles = {
  icon: {
    margin: 16,
  },
  button: {
    height: '56px',
    width: '56px',
    overflow: 'inherit'
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

  newVPanelProject() {
    this.loadNewProject('vpanel');
  }

  newUiProject() {
    this.loadNewProject('ui');
  }

  handleOpenFileVPanelProject(e) {
    this.loadProjectFile(e, 'vpanel');
  }

  handleOpenFileUiProject(e) {
    this.loadProjectFile(e, 'ui');
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
    this.loadProjectOnline(name, 'vpanel');
  }

  handleOpenOnlineUiProject(name) {
    this.setState({
      openOnlineUiProjectItems: null
    });
    if(!name) { return; }
    this.loadProjectOnline(name, 'ui');
  }

  loadNewProject(type) {
    let project;
    try {
      project = Facade.projects.new(type);
    } catch(err) {
      return DialogsActionCreators.error(err);
    }
  }

  loadProjectFile(e, type) {
    const file = e.target.files[0];
    e.target.value = '';

    const reader = new FileReader();

    reader.onloadend = () => {
      const err = reader.error;
      if(err) { return DialogsActionCreators.error(err); }
      const content = reader.result;
      let project;
      try {
        project = Facade.projects.open(type, content);
      } catch(err) {
        return DialogsActionCreators.error(err);
      }
    };

    reader.readAsText(file);
  }

  loadProjectOnline(resource, type) {
    function load(content) {
      let project;
      try {
        project = Facade.projects.open(type, content);
      } catch(err) {
        return DialogsActionCreators.error(err);
      }
    }

    const entity = OnlineStore.getResourceEntity();
    const cachedContent = entity.cachedResources && entity.cachedResources[resource];
    if(cachedContent) {
      return load(cachedContent);
    }

    // need to get content .. TODO: Flux pattern to do that ?
    DialogsActionCreators.setBusy('Loading project');
    return ResourcesActionCreators.resourceGetQuery(entity.id, resource, (err, content) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }
      return load(content);
    });
  }

  saveAll() {
    const projects = ProjectStore.getAll();
    DialogsActionCreators.setBusy('Saving projects');
    async.eachSeries(projects, (project, cb) => Facade.projects.saveOnline(project, cb), (err) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }
    });
  }

  saveOnline() {
    const project = this.getActiveTabProject();
    DialogsActionCreators.setBusy('Saving project');
    Facade.projects.saveOnline(project, (err) => {
      DialogsActionCreators.unsetBusy();
      if(err) { return DialogsActionCreators.error(err); }
    });
  }

  saveAs() {
    const project = this.getActiveTabProject();
    let content;
    try {
      content = Facade.projects.serialize(project);
    } catch(err) {
      return DialogsActionCreators.error(err);
    }

    base.utils.download(content, 'application/json', project.name + '.json');
  }

  getActiveTabProject() {
    const activeTabId = ActiveTabStore.getActiveTab();
    const projects = ProjectStore.getAll();
    return projects.find(p => p.id === activeTabId);
  }

  render() {
    const iconStyle = Object.assign({}, styles.icon, { fill: this.state.muiTheme.toolbar.iconColor});
    const project = this.getActiveTabProject();

    return (
    <mui.Toolbar>
      <mui.ToolbarGroup float="left">
        <base.icons.tabs.VPanel style={iconStyle} />
        <mui.ToolbarTitle text="vpanel" />

        <mui.IconButton tooltip="new"
                        style={styles.button}
                        onClick={this.newVPanelProject.bind(this)}>
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

        <mui.IconButton tooltip="new"
                        style={styles.button}
                        onClick={this.newUiProject.bind(this)}>
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

        <mui.IconButton tooltip="save all"
                        style={styles.button}
                        onClick={this.saveAll.bind(this)}>
          <base.icons.actions.SaveAll />
        </mui.IconButton>
        <mui.IconButton tooltip="save online"
                        style={styles.button}
                        disabled={!project}
                        onClick={this.saveOnline.bind(this)}>
          <base.icons.actions.Save />
        </mui.IconButton>
        <mui.IconButton tooltip="save as"
                        style={styles.button}
                        disabled={!project}
                        onClick={this.saveAs.bind(this)}>
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
