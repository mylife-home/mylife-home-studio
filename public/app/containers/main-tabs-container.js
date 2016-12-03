'use strict';

import React from 'react';

import MainTabs from '../components/main-tabs';

import ProjectStore from '../stores/project-store';
import ActiveTabStore from '../stores/active-tab-store';
import AppDispatcher from '../dispatcher/app-dispatcher';

import { tabActivate } from '../actions/index';

class MainTabsContainer extends React.Component {

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

  render() {

    const { projects, activeTab } = this.state;

    return (<MainTabs
      projects={projects}
      activeTab={activeTab}
      onTabChanged={(value) => AppDispatcher.dispatch(tabActivate(value))} />);
  }
}

export default MainTabsContainer;
