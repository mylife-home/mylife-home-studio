'use strict';

import React from 'react';
import * as mui from 'material-ui';

import FileCreateNewFolder from 'material-ui/svg-icons/file/create-new-folder';
import FileFolderOpen from 'material-ui/svg-icons/file/folder-open';
import ActionOpenInBrowser from 'material-ui/svg-icons/action/open-in-browser';
import ContentSave from 'material-ui/svg-icons/content/save';

class MainToolbar extends React.Component {
  render() { return (
    <mui.Toolbar>
      <mui.ToolbarGroup float="left">
        <mui.ToolbarTitle text="vpanel" />
        <mui.IconButton tooltip="new">
          <FileCreateNewFolder />
        </mui.IconButton>
        <mui.IconButton tooltip="open online">
          <FileFolderOpen />
        </mui.IconButton>
        <mui.IconButton tooltip="open from file">
          <ActionOpenInBrowser />
        </mui.IconButton>

        <mui.ToolbarSeparator />

        <mui.ToolbarTitle text="ui"/>
        <mui.IconButton tooltip="new">
          <FileCreateNewFolder />
        </mui.IconButton>
        <mui.IconButton tooltip="open online">
          <FileFolderOpen />
        </mui.IconButton>
        <mui.IconButton tooltip="open from file">
          <ActionOpenInBrowser />
        </mui.IconButton>

        <mui.ToolbarSeparator />

        <mui.IconButton tooltip="save all">
          <ContentSave />
        </mui.IconButton>
        <mui.IconButton tooltip="save">
          <ContentSave />
        </mui.IconButton>
        <mui.IconButton tooltip="save as">
          <ContentSave />
        </mui.IconButton>
      </mui.ToolbarGroup>
    </mui.Toolbar>
  ); }
}

export default MainToolbar;
