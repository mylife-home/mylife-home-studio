'use strict';

import async from 'async';
import React from 'react';
import * as mui from 'material-ui';
import base from './base/index';

import OnlineStore from '../stores/online-store';
import ProjectStore from '../stores/project-store';
import ActiveTabStore from '../stores/active-tab-store';

import Facade from '../services/facade';

import AppDispatcher from '../dispatcher/app-dispatcher';

import {
  dialogError, dialogSetBusy, dialogUnsetBusy,
  resourcesGetQuery
} from '../actions/index';

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
      openOnlineVPanelProjectItems: OnlineStore.getResourceNames('project.vpanel.').map(name => name.substring('project.vpanel.'.length))
    });
  }

  openOnlineUiProjectDialog() {
    this.setState({
      openOnlineUiProjectItems: OnlineStore.getResourceNames('project.ui.').map(name => name.substring('project.ui.'.length))
    });
  }

  handleOpenOnlineVPanelProject(name) {
    this.setState({
      openOnlineVPanelProjectItems: null
    });
    if(!name) { return; }
    this.loadProjectOnline('project.vpanel.' + name, 'vpanel');
  }

  handleOpenOnlineUiProject(name) {
    this.setState({
      openOnlineUiProjectItems: null
    });
    if(!name) { return; }
    this.loadProjectOnline('project.ui.' + name, 'ui');
  }

  loadNewProject(type) {
    try {
      Facade.projects.new(type);
    } catch(err) {
      return AppDispatcher.dispatch(dialogError(err));
    }
  }

  loadProjectFile(e, type) {
    const file = e.target.files[0];
    e.target.value = '';

    const reader = new FileReader();

    AppDispatcher.dispatch(dialogSetBusy('Loading project'));

    reader.onloadend = () => {
      AppDispatcher.dispatch(dialogUnsetBusy());
      const err = reader.error;
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }
      const content = reader.result;
      try {
        Facade.projects.open(type, content);
      } catch(err) {
        return AppDispatcher.dispatch(dialogError(err));
      }
    };

    reader.readAsText(file);
  }

  loadProjectOnline(resource, type) {
    function load(content) {
      try {
        Facade.projects.open(type, content);
      } catch(err) {
        return AppDispatcher.dispatch(dialogError(err));
      }
    }

    const entity = OnlineStore.getResourceEntity();
    const cachedContent = entity.cachedResources && entity.cachedResources[resource];
    if(cachedContent) {
      return load(cachedContent);
    }

    // need to get content .. TODO: Flux pattern to do that ?
    AppDispatcher.dispatch(dialogSetBusy('Loading project'));
    return resourcesGetQuery(entity.id, resource, (err, content) => {
      AppDispatcher.dispatch(dialogUnsetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }
      return load(content);
    });
  }

  saveAll() {
    const projects = ProjectStore.getAll();
    AppDispatcher.dispatch(dialogSetBusy('Saving projects'));
    async.eachSeries(projects, (project, cb) => Facade.projects.saveOnline(project, cb), (err) => {
      AppDispatcher.dispatch(dialogUnsetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }
    });
  }

  saveOnline() {
    const project = this.getActiveTabProject();
    AppDispatcher.dispatch(dialogSetBusy('Saving project'));
    Facade.projects.saveOnline(project, (err) => {
      AppDispatcher.dispatch(dialogUnsetBusy());
      if(err) { return AppDispatcher.dispatch(dialogError(err)); }
    });
  }

  saveAs() {
    const project = this.getActiveTabProject();
    let content;
    try {
      content = Facade.projects.serialize(project);
    } catch(err) {
      return AppDispatcher.dispatch(dialogError(err));
    }

    base.utils.download(content, 'application/json', project.name + '.json');
  }

  getActiveTabProject() {
    const activeTabId = ActiveTabStore.getActiveTab();
    return ProjectStore.get(activeTabId);
  }

  render() {
    const iconStyle = Object.assign({}, styles.icon, { fill: this.state.muiTheme.toolbar.iconColor});
    const project = this.getActiveTabProject();

    return (
    <mui.Toolbar>
      <mui.ToolbarGroup>
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
        style={{display : 'none'}}
        onChange={base.utils.stopPropagationWrapper(this.handleOpenFileVPanelProject.bind(this))}/>

      <input
        ref="openFileUiProject"
        type="file"
        style={{display : 'none'}}
        onChange={base.utils.stopPropagationWrapper(this.handleOpenFileUiProject.bind(this))}/>

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
