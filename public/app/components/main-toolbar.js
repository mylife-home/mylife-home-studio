'use strict';

import React from 'react';
import * as mui from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import base from './base/index';

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

  constructor(props) {
    super(props);
    this.state = {};
  }

  openFileVPanelProjectDialog() {
    this.refs.openFileVPanelProject.click();
  }

  openFileUiProjectDialog() {
    this.refs.openFileUiProject.click();
  }

  openOnlineVPanelProjectDialog() {
    this.setState({
      openOnlineVPanelProjectItems: this.props.onlineVPanelProjectList
    });
  }

  openOnlineUiProjectDialog() {
    this.setState({
      openOnlineUiProjectItems: this.props.onlineUiProjectList
    });
  }

  handleOpenOnlineVPanelProject(name) {
    this.setState({
      openOnlineVPanelProjectItems: null
    });
    if(!name) { return; }
    this.props.handleOpenOnlineVPanelProject(name);
  }

  handleOpenOnlineUiProject(name) {
    this.setState({
      openOnlineUiProjectItems: null
    });
    if(!name) { return; }
    this.props.handleOpenOnlineUiProject(name);
  }

  render() {
    const iconStyle = Object.assign({}, styles.icon, { fill: this.props.muiTheme.toolbar.iconColor});
    const project = this.props.activeProject;

    return (
      <mui.Toolbar>
        <mui.ToolbarGroup>
          <base.icons.tabs.VPanel style={iconStyle} />
          <mui.ToolbarTitle text="vpanel" />

          <mui.IconButton tooltip="new"
                          style={styles.button}
                          onClick={() => this.props.newVPanelProject()}>
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
                          onClick={() => this.props.newUiProject()}>
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
                          onClick={() => this.props.saveAll()}>
            <base.icons.actions.SaveAll />
          </mui.IconButton>
          <mui.IconButton tooltip="save online"
                          style={styles.button}
                          disabled={!project}
                          onClick={() => this.props.saveOnline(this.props.activeProject)}>
            <base.icons.actions.Save />
          </mui.IconButton>
          <mui.IconButton tooltip="save as"
                          style={styles.button}
                          disabled={!project}
                          onClick={() => this.props.saveAs(this.props.activeProject)}>
            <base.icons.actions.SaveAs />
          </mui.IconButton>
        </mui.ToolbarGroup>

        <input
          ref="openFileVPanelProject"
          type="file"
          style={{display : 'none'}}
          onChange={base.utils.stopPropagationWrapper((e) => this.props.handleOpenFileVPanelProject(e))}/>

        <input
          ref="openFileUiProject"
          type="file"
          style={{display : 'none'}}
          onChange={base.utils.stopPropagationWrapper((e) => this.props.handleOpenFileUiProject(e))}/>

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
    );
  }
}

MainToolbar.propTypes = {
  activeProject: React.PropTypes.object,
  onlineVPanelProjectList: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
  onlineUiProjectList: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
  newVPanelProject: React.PropTypes.func.isRequired,
  newUiProject: React.PropTypes.func.isRequired,
  handleOpenFileVPanelProject: React.PropTypes.func.isRequired,
  handleOpenFileUiProject: React.PropTypes.func.isRequired,
  handleOpenOnlineVPanelProject: React.PropTypes.func.isRequired,
  handleOpenOnlineUiProject: React.PropTypes.func.isRequired,
  saveAll: React.PropTypes.func.isRequired,
  saveOnline: React.PropTypes.func.isRequired,
  saveAs: React.PropTypes.func.isRequired
};

export default muiThemeable()(MainToolbar);
