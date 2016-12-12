'use strict';

import React from 'react';
import * as dnd from 'react-dnd';
import base from '../base/index';
import icons from '../icons';

import Facade from '../../services/facade';
import { dragTypes } from '../../constants/index';

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
};

function renderIcon(connectDragPreview, plugin) {

  switch(plugin.usage) {
    case Facade.metadata.pluginUsage.driver:
      return (
        <base.TooltipContainer tooltip="Hardware driver" tooltipPosition="bottom-right">
          {connectDragPreview(
            <div style={styles.iconContainer}>
              <icons.PluginDriver style={styles.icon} />
            </div>
          )}
        </base.TooltipContainer>
      );

    case Facade.metadata.pluginUsage.vpanel:
      return (
        <base.TooltipContainer tooltip="Virtual panel" tooltipPosition="bottom-right">
          {connectDragPreview(
            <div style={styles.iconContainer}>
              <icons.PluginVPanel style={styles.icon} />
            </div>
          )}
        </base.TooltipContainer>
      );

    case Facade.metadata.pluginUsage.ui:
      return (
        <base.TooltipContainer tooltip="UI" tooltipPosition="bottom-right">
          {connectDragPreview(
            <div style={styles.iconContainer}>
              <icons.PluginUi style={styles.icon} />
            </div>
          )}
        </base.TooltipContainer>
      );

    default:
      return null;
  }
}

const ToolboxPlugin = ({ connectDragSource, connectDragPreview, isDragging, plugin }) => connectDragSource(
  <div style={{
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move'
  }}>
    {renderIcon(connectDragPreview, plugin)}
    <div style={styles.textContainer}>{plugin.library + ':' + plugin.type}</div>
  </div>
);

ToolboxPlugin.propTypes = {
  project: React.PropTypes.object.isRequired,
  plugin: React.PropTypes.object.isRequired,
  onNewComponent: React.PropTypes.func.isRequired,
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
    const { project, onNewComponent } = props;
    const { location } = monitor.getDropResult();
    onNewComponent(project, location, plugin);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

export default dnd.DragSource(dragTypes.VPANEL_PLUGIN, pluginSource, collect)(ToolboxPlugin);

