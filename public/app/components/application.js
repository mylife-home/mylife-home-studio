'use strict';

import React from 'react';
import * as muiStyles from 'material-ui/styles/index';
import * as dnd from 'react-dnd';
import dndHTML5Backend from 'react-dnd-html5-backend';

import MainTabsContainer from '../containers/main-tabs-container';
import MainToolbarContainer from '../containers/main-toolbar-container';
import MainDialogError from '../containers/main-dialog-error';
import MainDialogBusy from '../containers/main-dialog-busy';
import MainDialogInfo from '../containers/main-dialog-info';
import MainDialogOperationSelect from '../containers/main-dialog-operation-select';

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

// class needed by dnd.DragDropContext
class Application extends React.Component {

  render() {
    return (
      <muiStyles.MuiThemeProvider muiTheme={styles.theme}>
        <div style={styles.root}>
          <MainToolbarContainer />
          <MainTabsContainer />
          <MainDialogError />
          <MainDialogBusy />
          <MainDialogInfo />
          <MainDialogOperationSelect />
        </div>
      </muiStyles.MuiThemeProvider>
    );
  }
}

export default dnd.DragDropContext(dndHTML5Backend)(Application);
