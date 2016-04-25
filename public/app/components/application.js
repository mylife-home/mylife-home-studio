'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as muiStyles from 'material-ui/styles/index';
import base from './base/index';

import MainToolbar from './main-toolbar';
import OnlineTab from './online-tab/index';
import VPanelProjectTab from './vpanel-project-tab/index';
import UiProjectTab from './ui-project-tab/index';

import ProjectStore from '../stores/project-store';
import ActiveTabStore from '../stores/active-tab-store';

import TabActionCreators from '../actions/tab-action-creators';

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
    position: 'relative',
    zIndex : -1, // need that for toolbar tooltips ?!
  },
  tabContainer: {
    height : 'calc(100% - 54px)',
  },
  theme: muiStyles.getMuiTheme(muiStyles.lightBaseTheme)
};

class Application extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      projects: ProjectStore.getAll(),
      activeTab: ActiveTabStore.getActiveTab()
    }
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.handleStoreChange.bind(this));
    ActiveTabStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.handleStoreChange.bind(this));
    ActiveTabStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
    this.setState({
      projects: ProjectStore.getAll(),
      activeTab: ActiveTabStore.getActiveTab()
    });
  }

  render() {
    const tabs = this.state.projects.map((project) => {
      switch(project.type) {
      case 'vpanel':
        return (
          <mui.Tab value={project.id}
                   key={project.id}
                   label={project.name}
                   icon={<base.icons.tabs.VPanel />}>
            <VPanelProjectTab project={project} />
          </mui.Tab>
        );

      case 'ui':
        return (
          <mui.Tab value={project.id}
                   key={project.id}
                   label={project.name}
                   icon={<base.icons.tabs.Ui />}>
            <UiProjectTab project={project} />
          </mui.Tab>
        );

      default:
        throw new Error(`project type not supported: ${project.type}`);
      }
    });

    return (
      <muiStyles.MuiThemeProvider muiTheme={styles.theme}>
        <div style={styles.root}>
          <mui.AppBar title="MyLife Home Studio" showMenuIconButton={false}/>
          <MainToolbar />
          <mui.Tabs value={this.state.activeTab}
                    onChange={(value) => TabActionCreators.activate(value)}
                    style={styles.tabs}
                    contentContainerStyle={styles.tabContainer}
                    tabTemplate={base.TabTemplate}>
            <mui.Tab value="online"
                     label="Online"
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
