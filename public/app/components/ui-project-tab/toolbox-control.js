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

class ToolboxControl extends React.Component {

  constructor(props) {
    super(props);
  }

  renderIcon() {
    const { connectDragPreview, type } = this.props;

    switch(type) {
    case 'text':
      return (
        <base.TooltipContainer tooltip="Text" tooltipPosition="bottom-right">
          {connectDragPreview(
            <div style={styles.iconContainer}>
              <base.icons.UiText style={styles.icon} />
            </div>
          )}
        </base.TooltipContainer>
      );

    case 'image':
      return (
        <base.TooltipContainer tooltip="Image" tooltipPosition="bottom-right">
          {connectDragPreview(
            <div style={styles.iconContainer}>
              <base.icons.UiImage style={styles.icon} />
            </div>
          )}
        </base.TooltipContainer>
      );

    default:
      return null;
    }
  }

  renderText() {
    const { type } = this.props;

    switch(type) {
    case 'text':
      return 'Text control';

    case 'image':
      return 'Image control';

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
        <div style={styles.textContainer}>{this.renderText()}</div>
      </div>
    );
  }
}

ToolboxControl.propTypes = {
  project: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  connectDragPreview: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};

const pluginSource = {
  beginDrag(props) {
    return {
      type: props.type
    };
  },

  endDrag(props, monitor) {
    if(!monitor.didDrop()) { return; }

    const { project, type } = props;
    const { location } = monitor.getDropResult();

    // TODO
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

export default dnd.DragSource(AppConstants.DragTypes.UI_TOOLBOX_CONTROL, pluginSource, collect)(ToolboxControl);

