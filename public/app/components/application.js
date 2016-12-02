'use strict';

import React from 'react';
import * as mui from 'material-ui';
import * as muiStyles from 'material-ui/styles/index';
import * as dnd from 'react-dnd';
import dndHTML5Backend from 'react-dnd-html5-backend';
import base from './base/index';

import MainToolbar from './main-toolbar';
import OnlineTab from './online-tab/index';
import VPanelProjectTab from './vpanel-project-tab/index';
import UiProjectTab from './ui-project-tab/index';

import ProjectStore from '../stores/project-store';
import ActiveTabStore from '../stores/active-tab-store';
import AppDispatcher from '../dispatcher/app-dispatcher';

import { tabActivate } from '../actions/index';

const styles = {
  root: {
    position: 'fixed',
    top:0,
    bottom:0,
    left:0,
    right:0,
  },
  tabs: {
    height : 'calc(100% - 56px)',
    position: 'relative',
    zIndex : -1, // need that for toolbar tooltips ?!
  },
  tabContainer: {
    height : 'calc(100% - 30px)',
  },
  tabLabelIcon: {
    float: 'left'
  },
  tabLabelText: {
    display: 'inline-block',
    verticalAlign: 'middle',
    lineHeight: '24px',
    marginLeft: '10px'
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

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
    ActiveTabStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
    ActiveTabStore.removeChangeListener(this.boundHandleStoreChange);
  }

  handleStoreChange() {
    this.setState({
      projects: ProjectStore.getAll(),
      activeTab: ActiveTabStore.getActiveTab()
    });
  }

  renderTabLabel(text, icon) {
    return(
      <div>
        <div style={styles.tabLabelIcon}>{icon}</div>
        <div style={styles.tabLabelText}>{text}</div>
      </div>
    );
  }

  render() {
    const tabs = this.state.projects.map((project) => {
      let title = project.name;
      if(project.dirty) { title += ' *'; }
      switch(project.type) {
      case 'vpanel':
        return (
          <mui.Tab value={project.uid}
                   key={project.uid}
                   label={this.renderTabLabel(title, (<base.icons.tabs.VPanel />))}>
            <VPanelProjectTab project={project} />
          </mui.Tab>
        );

      case 'ui':
        return (
          <mui.Tab value={project.uid}
                   key={project.uid}
                   label={this.renderTabLabel(title, (<base.icons.tabs.Ui />))}>
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
          <MainToolbar />
          <mui.Tabs value={this.state.activeTab}
                    onChange={(value) => AppDispatcher.dispatch(tabActivate(value)) }
                    style={styles.tabs}
                    contentContainerStyle={styles.tabContainer}
                    tabTemplate={base.TabTemplate}>
            <mui.Tab value="online"
                     label={this.renderTabLabel('Online', (<base.icons.tabs.Online />))}>
              <OnlineTab />
            </mui.Tab>
            {tabs}
          </mui.Tabs>
          <base.DialogError />
          <base.DialogBusy />
        </div>
      </muiStyles.MuiThemeProvider>
    );
  }
}

export default dnd.DragDropContext(dndHTML5Backend)(Application);
