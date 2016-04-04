'use strict';

import React from 'react';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import IconButton from 'material-ui/lib/icon-button';

import FileCreateNewFolder from 'material-ui/lib/svg-icons/file/create-new-folder';
import FileFolderOpen from 'material-ui/lib/svg-icons/file/folder-open';
import ActionOpenInBrowser from 'material-ui/lib/svg-icons/action/open-in-browser';
import ContentSave from 'material-ui/lib/svg-icons/content/save';

class MainToolbar extends React.Component {
  render() { return (
    <Toolbar>
      <ToolbarGroup float="left">
        <ToolbarTitle text="vpanel" />
        <IconButton tooltip="new">
          <FileCreateNewFolder />
        </IconButton>
        <IconButton tooltip="open online">
          <FileFolderOpen />
        </IconButton>
        <IconButton tooltip="open from file">
          <ActionOpenInBrowser />
        </IconButton>

        <ToolbarSeparator />

        <ToolbarTitle text="ui"/>
        <IconButton tooltip="new">
          <FileCreateNewFolder />
        </IconButton>
        <IconButton tooltip="open online">
          <FileFolderOpen />
        </IconButton>
        <IconButton tooltip="open from file">
          <ActionOpenInBrowser />
        </IconButton>

        <ToolbarSeparator />

        <IconButton tooltip="save all">
          <ContentSave />
        </IconButton>
        <IconButton tooltip="save">
          <ContentSave />
        </IconButton>
        <IconButton tooltip="save as">
          <ContentSave />
        </IconButton>
      </ToolbarGroup>
    </Toolbar>
  ); }
}

export default MainToolbar;
