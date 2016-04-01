'use strict';

import React from 'react';
import AppBar from 'material-ui/lib/app-bar';

import MainToolbar from './main-toolbar';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

import HelloWorld from './hello-world-component';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class Application extends React.Component {
  render() { return (
    <div>
      <AppBar title="MyLife Home Studio" showMenuIconButton={false}/>
      <MainToolbar />
      <Tabs>
        <Tab label="Item One">
          <div>
            <h2 style={styles.headline}>Tab One</h2>
            <p>
              This is an example tab.
            </p>
            <HelloWorld/>
          </div>
        </Tab>
        <Tab label="Item Two" >
          <div>
            <h2 style={styles.headline}>Tab Two</h2>
            <p>
              This is another example tab.
            </p>
          </div>
        </Tab>
      </Tabs>
    </div>
  ); }
}

export default Application;