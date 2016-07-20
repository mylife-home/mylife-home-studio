'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ToolboxControl from './toolbox-control';

class Toolbox extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const project = this.props.project;

    return (
      <mui.List>
        <mui.ListItem key={'text'}>
          <ToolboxControl project={project} type={'text'}></ToolboxControl>
        </mui.ListItem>
        <mui.ListItem key={'image'}>
          <ToolboxControl project={project} type={'image'}></ToolboxControl>
        </mui.ListItem>
      </mui.List>
    );
  }
}

Toolbox.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Toolbox;
