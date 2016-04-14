'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as muiStyles from 'material-ui/styles/index';
import base from './base/index';

import MainToolbar from './main-toolbar';
import OnlineTab from './online-tab/index';

const styles = {
  root: {
    position: 'fixed',
    top:0,
    bottom:0,
    left:0,
    right:0,
  },
  tabs: {
    height : 'calc(100% - 120px)',
    position: 'relative'
  },
  tabContainer: {
    height : 'calc(100% - 54px)'
  },
  theme: muiStyles.getMuiTheme(muiStyles.lightBaseTheme)
};


class Application extends React.Component {
  render() { return (
    <muiStyles.MuiThemeProvider muiTheme={styles.theme}>
      <div style={styles.root}>
        <mui.AppBar title="MyLife Home Studio" showMenuIconButton={false}/>
        <MainToolbar />
        <mui.Tabs style={styles.tabs}
                  contentContainerStyle={styles.tabContainer}
                  tabTemplate={base.TabTemplate}>
          <mui.Tab label="Online"
                   icon={<base.icons.tabs.Online />}>
            <OnlineTab />
          </mui.Tab>
          <mui.Tab label="Item Two">
            <div>
              <h2>Tab Two</h2>
              <p>
                This is another example tab.
              </p>
            </div>
          </mui.Tab>
        </mui.Tabs>
      </div>
    </muiStyles.MuiThemeProvider>
  ); }
}

export default Application;
