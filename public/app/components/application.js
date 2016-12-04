'use strict';

import React from 'react';
import * as muiStyles from 'material-ui/styles/index';
import * as dnd from 'react-dnd';
import dndHTML5Backend from 'react-dnd-html5-backend';
import base from './base/index';

import MainToolbar from './main-toolbar';
import MainTabsContainer from '../containers/main-tabs-container';
import MainToolbarContainer from '../containers/main-toolbar-container';
import MainDialogs from '../containers/main-dialogs';

const styles = {
  root: {
    position: 'fixed',
    top:0,
    bottom:0,
    left:0,
    right:0,
  },
  theme: muiStyles.getMuiTheme(muiStyles.lightBaseTheme)
};

const Application = () => (
  <muiStyles.MuiThemeProvider muiTheme={styles.theme}>
    <div style={styles.root}>
      <MainToolbarContainer />
      <MainTabsContainer />
      <MainDialogs />
    </div>
  </muiStyles.MuiThemeProvider>
);

export default dnd.DragDropContext(dndHTML5Backend)(Application);
