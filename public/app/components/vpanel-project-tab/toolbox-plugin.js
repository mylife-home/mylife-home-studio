'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import base from '../base/index';

import AppConstants from '../../constants/app-constants';

class ToolboxPlugin extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { connectDragSource, isDragging, plugin } = this.props;

    return connectDragSource(
      <div style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}>
        {plugin.library + ':' + plugin.type}
      </div>
    );
  }
}

ToolboxPlugin.propTypes = {
  plugin: React.PropTypes.object.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
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
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

export default dnd.DragSource(AppConstants.DragTypes.VPANEL_PLUGIN, pluginSource, collect)(ToolboxPlugin);

