'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import Toolbar from './toolbar';

class Toolbox extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const project = this.props.project;

    return (
      <div>
        TOOLBOX
        <ul>
          {project.toolbox.map((item) => (
            <li key={item.entityId}>
              {item.entityId}
              <ul>
                {item.plugins.map((plugin) => (
                  <li key={plugin.library + ':' + plugin.type}>
                    {plugin.library + ':' + plugin.type}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <Toolbar project={project} />
      </div>
    );
  }
}

Toolbox.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Toolbox;

