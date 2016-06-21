'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import base from '../base/index';

import Facade from '../../services/facade';
import AppConstants from '../../constants/app-constants';

class CanvasComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { component, connectDragSource, connectDragPreview, isDragging } = this.props;
    const location = component.designer.location;

    if(isDragging) {
      return null;
    }

    return connectDragPreview(
      <div style={{
        position : 'absolute',
        left    : location.x,
        top     : location.y
      }}>
        <mui.Paper>
          {connectDragSource(
            <div style={{ cursor: 'move' }}>
              {component.id}
            </div>
          )}
          <table>
            <tbody>
              <tr><td>entity</td><td>&nbsp;</td><td>{component.plugin.entityId}</td></tr>
              <tr><td>plugin</td><td>&nbsp;</td><td>{component.plugin.library + ':' + component.plugin.type}</td></tr>
              <tr><td>bindings</td><td>&nbsp;</td><td>
                <ul>
                {component.bindings.map((binding) => (
                  <li key={binding.local_action + ':' + binding.remote_id + ':' + binding.remote_attribute}>
                    {binding.remote_id + ':' + binding.remote_attribute + ' -> ' + binding.local_action}
                  </li>
                ))}
                </ul>
              </td></tr>
              <tr><td>config</td><td>&nbsp;</td><td>{JSON.stringify(component.config)}</td></tr>
              <tr><td>designer</td><td>&nbsp;</td><td>{JSON.stringify(component.designer)}</td></tr>
            </tbody>
          </table>
        </mui.Paper>
      </div>
    );
  }
}

CanvasComponent.propTypes = {
  project: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  connectDragPreview: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired
};


const componentSource = {
  beginDrag(props) {
    const component = props.component;
    return {
      id: component.id
    };
  },

  endDrag(props, monitor) {
    if(!monitor.didDrop()) { return; }

    const { component, project } = props;

    const location = component.designer.location;
    const result = monitor.getDropResult();
    location.x += Math.round(result.delta.x);
    location.y += Math.round(result.delta.y);

    // keep ui fluid
    window.setTimeout(() => Facade.projects.dirtify(project), 0);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

export default dnd.DragSource(AppConstants.DragTypes.VPANEL_COMPONENT, componentSource, collect)(CanvasComponent);;