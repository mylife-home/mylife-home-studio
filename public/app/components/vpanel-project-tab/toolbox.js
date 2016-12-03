'use strict';

import React from 'react';
import * as mui from 'material-ui';

import Toolbar from './toolbar';
import ToolboxPlugin from './toolbox-plugin';

import tabStyles from '../base/tab-styles';

const styles = {
  pluginList: {
    height: 'calc(100% - 74px)'
  }
};

class Toolbox extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const project = this.props.project;

    const items = [];

    project.toolbox.forEach(item => {
      const entityId = item.entityId;
      const entityName = entityId.substr(entityId.indexOf('_') + 1);

      items.push(<mui.Subheader key={entityId}>{entityName}</mui.Subheader>);

      item.plugins.forEach(plugin => {
        items.push(
          <mui.ListItem key={`${entityId}:${plugin.library}:${plugin.type}`}>
            <ToolboxPlugin project={project} plugin={plugin}></ToolboxPlugin>
          </mui.ListItem>
        );
      });
    });

    return (
      <div style={Object.assign({}, tabStyles.fullHeight)}>
        <mui.List style={Object.assign({}, tabStyles.scrollable, styles.pluginList)}>
          {items}
        </mui.List>
        <Toolbar project={project} />
      </div>
    );
  }
}

Toolbox.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Toolbox;

