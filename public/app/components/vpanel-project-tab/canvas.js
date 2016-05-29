'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

class Canvas extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const project = this.props.project;

    // {JSON.stringify(project._raw)}
    return (
      <div>
        CANVAS
        <ul>
          {project.components.map((component) => (
            <li key={component.id}>
              {component.id}
              <table>
                <tbody>
                  <tr><td>entity</td><td>&nbsp;</td><td>{component.plugin.entityId}</td></tr>
                  <tr><td>plugin</td><td>&nbsp;</td><td>{component.plugin.library + ':' + component.plugin.type}</td></tr>
                  <tr><td>bindings</td><td>&nbsp;</td><td>
                    <ul>
                    {component.bindings.map((binding) => (
                      <li key={binding.local_action + ':' + binding.remote_id + ':' + binding.remote_attribute}>
                        {binding.local_action + ' -> ' + binding.remote_id + ':' + binding.remote_attribute}
                      </li>
                    ))}
                    </ul>
                  </td></tr>
                  <tr><td>config</td><td>&nbsp;</td><td>{JSON.stringify(component.config)}</td></tr>
                  <tr><td>designer</td><td>&nbsp;</td><td>{JSON.stringify(component.designer)}</td></tr>
                </tbody>
              </table>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Canvas.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Canvas;