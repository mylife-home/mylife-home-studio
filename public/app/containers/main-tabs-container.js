'use strict';

import React from 'react';

import MainTabs from '../components/main-tabs';

import ProjectStore from '../stores/project-store';
import AppDispatcher from '../compat/dispatcher';
import storeHandler from '../compat/store';

import { tabActivate } from '../actions/index';

class MainTabsContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      projects: ProjectStore.getAll(),
      activeTab: storeHandler.getStore().getState().activeTab
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = storeHandler.getStore().subscribe(this.boundHandleStoreChange);
    ProjectStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this.boundHandleStoreChange);
    this.unsubscribe();
  }

  handleStoreChange() {
    this.setState({
      projects: ProjectStore.getAll(),
      activeTab: storeHandler.getStore().getState().activeTab
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
