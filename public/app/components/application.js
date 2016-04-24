'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as muiStyles from 'material-ui/styles/index';
import base from './base/index';

import MainToolbar from './main-toolbar';
import OnlineTab from './online-tab/index';

import ProjectStore from '../stores/project-store';

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

  constructor(props) {
    super(props);
    this.state = {
      projects: ProjectStore.getAll()
    }
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
    this.setState({
      projects: ProjectStore.getAll()
    });
  }

  render() {
    const tabs = this.state.projects.map((project) => (
      <mui.Tab key={project.id} label={project.name}>
        <div>
          <h2>{project.name}</h2>
          <p>
            TODO
          </p>
        </div>
      </mui.Tab>
    ));

    return (
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
            {tabs}
          </mui.Tabs>
          <base.DialogError />
        </div>
      </muiStyles.MuiThemeProvider>
    );
  }
}

export default Application;
