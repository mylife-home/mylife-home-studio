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

const MainToolbar = ({
  muiTheme, activeProject, onlineVPanelProjectList, onlineUiProjectList,
  onNewVPanelProject, onNewUiProject, onOpenFileVPanelProject, onOpenFileUiProject, onOpenOnlineVPanelProject, onOpenOnlineUiProject, onSaveAll, onSaveOnline, onSaveAs }) => {

  const iconStyle = Object.assign({}, styles.icon, { fill: muiTheme.toolbar.iconColor});

  return (
    <mui.Toolbar>
      <mui.ToolbarGroup>
        <base.icons.tabs.VPanel style={iconStyle} />
        <mui.ToolbarTitle text="vpanel" />

        <mui.IconButton tooltip="new"
                        style={styles.button}
                        onClick={() => onNewVPanelProject()}>
          <base.icons.actions.New />
        </mui.IconButton>
        <base.IconSelectButton tooltip="open online"
                              style={styles.button}
                              selectTitle={"Select VPanel Project"}
                              selectItems={onlineVPanelProjectList}
                              onItemSelect={onOpenOnlineVPanelProject}>
          <base.icons.actions.OpenOnline />
        </base.IconSelectButton>
        <base.IconFileButton tooltip="open from file"
                             style={styles.button}
                             onFileSelected={onOpenFileVPanelProject}>
          <base.icons.actions.OpenFile />
        </base.IconFileButton>

        <mui.ToolbarSeparator />

        <base.icons.tabs.Ui style={iconStyle} />
        <mui.ToolbarTitle text="ui"/>

        <mui.IconButton tooltip="new"
                        style={styles.button}
                        onClick={() => onNewUiProject()}>
          <base.icons.actions.New />
        </mui.IconButton>
        <base.IconSelectButton tooltip="open online"
                              style={styles.button}
                              selectTitle={"Select UI Project"}
                              selectItems={onlineUiProjectList}
                              onItemSelect={onOpenOnlineUiProject}>
          <base.icons.actions.OpenOnline />
        </base.IconSelectButton>
        <base.IconFileButton tooltip="open from file"
                             style={styles.button}
                             onFileSelected={onOpenFileUiProject}>
          <base.icons.actions.OpenFile />
        </base.IconFileButton>

        <mui.ToolbarSeparator />

        <mui.IconButton tooltip="save all"
                        style={styles.button}
                        onClick={() => onSaveAll()}>
          <base.icons.actions.SaveAll />
        </mui.IconButton>
        <mui.IconButton tooltip="save online"
                        style={styles.button}
                        disabled={!activeProject}
                        onClick={() => onSaveOnline(activeProject)}>
          <base.icons.actions.Save />
        </mui.IconButton>
        <mui.IconButton tooltip="save as"
                        style={styles.button}
                        disabled={!activeProject}
                        onClick={() => onSaveAs(activeProject)}>
          <base.icons.actions.SaveAs />
        </mui.IconButton>
      </mui.ToolbarGroup>
    </mui.Toolbar>
  );
};

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
