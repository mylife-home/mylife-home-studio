'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import Facade from '../../services/facade';

class PropertiesEditor extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = { };
  }

  renderString() {
    const { project, object, property } = this.props;
    return (
      <mui.TextField
        id={`${project.id}:${property}`}
        value={object[property]}
        onChange={this.onStringChange.bind(this)} />
    );
  }

  onStringChange(event) {
    const text = event.target.value;
    const { project, object, property } = this.props;

    object[property] = text;
    Facade.projects.dirtify(project);
  }

  render() {
    const { type } = this.props;

    switch(type) {
    case 's':
      return this.renderString();
    default:
      console.log(type);
      return null;
    }
  }

}

PropertiesEditor.propTypes = {
  project  : React.PropTypes.object.isRequired,
  object   : React.PropTypes.object.isRequired,
  property : React.PropTypes.string.isRequired,
  type     : React.PropTypes.string.isRequired
};

export default PropertiesEditor;