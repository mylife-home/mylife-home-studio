'use strict';

import React from 'react';

import MainTabs from '../components/main-tabs';

import AppDispatcher from '../compat/dispatcher';
import storeHandler from '../compat/store';

import { tabActivate } from '../actions/index';

class MainTabsContainer extends React.Component {

  constructor(props) {
    super(props);

    const state = storeHandler.getStore().getState();

    this.state = {
      projects: Array.from(state.projects.projects.toArray()),
      activeTab: state.activeTab
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = storeHandler.getStore().subscribe(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleStoreChange() {
    const state = storeHandler.getStore().getState();

    this.setState({
      projects: Array.from(state.projects.projects.toArray()),
      activeTab: state.activeTab
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
