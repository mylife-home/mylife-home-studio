'use strict';

import { connect } from 'react-redux';

import MainTabs from '../components/main-tabs';

import { getProjects } from '../selectors/projects';
import { tabActivate } from '../actions/index';

const mapStateToProps = (state) => ({
  projects: getProjects(state).toArray(),
  activeTab: state.activeTab
});


const mapDispatchToProps = ({
  onTabChanged : tabActivate
});

const MainTabsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainTabs);

export default MainTabsContainer;

