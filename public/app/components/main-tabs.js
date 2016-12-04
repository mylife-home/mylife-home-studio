'use strict';

import React from 'react';
import * as mui from 'material-ui';
import base from './base/index';

import OnlineTab from './online-tab/index';
import VPanelProjectTab from './vpanel-project-tab/index';
import UiProjectTab from './ui-project-tab/index';

const styles = {
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
  }
};

function renderTabLabel(text, icon) {
  return(
    <div>
      <div style={styles.tabLabelIcon}>{icon}</div>
      <div style={styles.tabLabelText}>{text}</div>
    </div>
  );
}

const MainTabs = ({ projects, activeTab, onTabChanged }) => (
  <mui.Tabs value={activeTab}
            onChange={onTabChanged}
            style={styles.tabs}
            contentContainerStyle={styles.tabContainer}
            tabTemplate={base.TabTemplate}>
    <mui.Tab value="online"
             label={renderTabLabel('Online', (<base.icons.tabs.Online />))}>
      <OnlineTab />
    </mui.Tab>
    {projects.map((project) => {
      let title = project.name;
      if(project.dirty) { title += ' *'; }
      switch(project.type) {
        case 'vpanel':
          return (
            <mui.Tab value={project.uid}
                     key={project.uid}
                     label={renderTabLabel(title, (<base.icons.tabs.VPanel />))}>
              <VPanelProjectTab project={project} />
            </mui.Tab>
          );

        case 'ui':
          return (
            <mui.Tab value={project.uid}
                     key={project.uid}
                     label={renderTabLabel(title, (<base.icons.tabs.Ui />))}>
              <UiProjectTab project={project} />
            </mui.Tab>
          );

        default:
          throw new Error(`project type not supported: ${project.type}`);
      }
    })}
  </mui.Tabs>
);

MainTabs.propTypes = {
  projects: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
  activeTab: React.PropTypes.string.isRequired,
  onTabChanged: React.PropTypes.func.isRequired
};

export default MainTabs;
