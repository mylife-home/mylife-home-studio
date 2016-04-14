'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from './base/index';

class MainToolbar extends React.Component {
  render() { return (
    <mui.Toolbar>
      <mui.ToolbarGroup float="left">
        <mui.ToolbarTitle text="vpanel" />
        <mui.IconButton tooltip="new">
          <base.icons.toolbar.New />
        </mui.IconButton>
        <mui.IconButton tooltip="open online">
          <base.icons.toolbar.OpenOnline />
        </mui.IconButton>
        <mui.IconButton tooltip="open from file">
          <base.icons.toolbar.OpenFile />
        </mui.IconButton>

        <mui.ToolbarSeparator />

        <mui.ToolbarTitle text="ui"/>
        <mui.IconButton tooltip="new">
          <base.icons.toolbar.New />
        </mui.IconButton>
        <mui.IconButton tooltip="open online">
          <base.icons.toolbar.OpenOnline />
        </mui.IconButton>
        <mui.IconButton tooltip="open from file">
          <base.icons.toolbar.OpenFile />
        </mui.IconButton>

        <mui.ToolbarSeparator />

        <mui.IconButton tooltip="save all">
          <base.icons.toolbar.SaveAll />
        </mui.IconButton>
        <mui.IconButton tooltip="save">
          <base.icons.toolbar.Save />
        </mui.IconButton>
        <mui.IconButton tooltip="save as">
          <base.icons.toolbar.SaveAs />
        </mui.IconButton>
      </mui.ToolbarGroup>
    </mui.Toolbar>
  ); }
}

export default MainToolbar;
