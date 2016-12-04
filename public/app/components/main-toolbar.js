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
          <base.IconFileButton tooltip="open from file"
                               style={styles.button}
                               onFileSelected={this.props.handleOpenFileVPanelProject}>
            <base.icons.actions.OpenFile />
          </base.IconFileButton>

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
          <base.IconFileButton tooltip="open from file"
                               style={styles.button}
                               onClick={this.props.handleOpenFileUiProject}>
            <base.icons.actions.OpenFile />
          </base.IconFileButton>

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
  onNewVPanelProject: React.PropTypes.func.isRequired,
  onNewUiProject: React.PropTypes.func.isRequired,
  onOpenFileVPanelProject: React.PropTypes.func.isRequired,
  onOpenFileUiProject: React.PropTypes.func.isRequired,
  onOpenOnlineVPanelProject: React.PropTypes.func.isRequired,
  onOpenOnlineUiProject: React.PropTypes.func.isRequired,
  onSaveAll: React.PropTypes.func.isRequired,
  onSaveOnline: React.PropTypes.func.isRequired,
  onSaveAs: React.PropTypes.func.isRequired
};

export default muiThemeable()(MainToolbar);
