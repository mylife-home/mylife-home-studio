'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import * as dnd from 'react-dnd';
import base from '../base/index';

class CanvasComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { component } = this.props;
    const location = component.designer.location;

    return (
      <div style={{
        position : 'absolute',
        left    : location.x + 'px',
        top     : location.y + 'px'
      }}>
        <mui.Paper>
          {component.id}
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
  component: React.PropTypes.object.isRequired
};

export default CanvasComponent;