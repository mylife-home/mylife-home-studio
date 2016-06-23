'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import base from '../base/index';

import Facade from '../../services/facade';
import AppConstants from '../../constants/app-constants';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

const styles = {
  iconContainer: {
    float  : 'left',
    width  : '32px',
    height : '32px'
  },
  icon: {
    textAlign     : 'center',
    height        : '32px',
    lineHeight    : '32px',
    verticalAlign : 'middle'
  },
  textContainer: {
    lineHeight : '32px',
    margin     : '0px',
    marginLeft : '40px'
  }
}

class ToolboxPlugin extends React.Component {

  constructor(props) {
    super(props);
  }

  renderIcon() {
    const { connectDragPreview, plugin } = this.props;

    switch(plugin.usage) {
    case Facade.metadata.pluginUsage.driver:
      return (
        <base.TooltipContainer tooltip="Hardware driver" tooltipPosition="bottom-right">
          {connectDragPreview(
            <div style={styles.iconContainer}>
              <base.icons.PluginDriver style={styles.icon} />
            </div>
          )}
        </base.TooltipContainer>
      );

    case Facade.metadata.pluginUsage.vpanel:
      return (
        <base.TooltipContainer tooltip="Virtual panel" tooltipPosition="bottom-right">
          {connectDragPreview(
            <div style={styles.iconContainer}>
              <base.icons.PluginVPanel style={styles.icon} />
            </div>
          )}
        </base.TooltipContainer>
      );

    case Facade.metadata.pluginUsage.ui:
      return (
        <base.TooltipContainer tooltip="UI" tooltipPosition="bottom-right">
          {connectDragPreview(
            <div style={styles.iconContainer}>
              <base.icons.PluginUi style={styles.icon} />
            </div>
          )}
        </base.TooltipContainer>
      );

    default:
      return null;
    }
  }

  render() {
    const { connectDragSource, connectDragPreview, isDragging, plugin } = this.props;

    return connectDragSource(
      <div style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}>
        {this.renderIcon()}
        <div style={styles.textContainer}>{plugin.library + ':' + plugin.type}</div>
      </div>
    );
  }
}

ToolboxPlugin.propTypes = {
  project: React.PropTypes.object.isRequired,
  plugin: React.PropTypes.object.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  connectDragPreview: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};

const pluginSource = {
  beginDrag(props) {
    const plugin = props.plugin;
    return {
      entityId: plugin.entityId,
      library: plugin.library,
      type: plugin.type
    };
  },

  endDrag(props, monitor) {
    if(!monitor.didDrop()) { return; }

    const plugin = monitor.getItem();
    const { project } = props;
    const { location } = monitor.getDropResult();

    const component = Facade.projects.vpanelCreateComponent(project, location, plugin);

    const projectState = ProjectStateStore.getProjectState(project);
    projectState.selection = component.id;
    ProjectActionCreators.stateRefresh(project);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

export default dnd.DragSource(AppConstants.DragTypes.VPANEL_PLUGIN, pluginSource, collect)(ToolboxPlugin);

