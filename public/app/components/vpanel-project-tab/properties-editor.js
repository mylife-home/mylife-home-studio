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
        id={`${project.uid}:${property}`}
        value={object[property]}
        onChange={base.utils.stopPropagationWrapper(this.onStringChange.bind(this))} />
    );
  }

  onStringChange(event) {
    this.changeProp(event.target.value);
  }

  renderInteger() {
    const { project, object, property } = this.props;
    return (
      <mui.TextField
        id={`${project.uid}:${property}`}
        value={object[property]}
        onChange={base.utils.stopPropagationWrapper(this.onIntegerChange.bind(this))}
        type='number' />
    );
  }

  onIntegerChange(event) {
    const value = parseInt(event.target.value, 10);
    if(!isNaN(value)) {
      this.changeProp(event.target.value);
    }
  }

  renderNumber() {
    const { project, object, property } = this.props;
    return (
      <mui.TextField
        id={`${project.uid}:${property}`}
        value={object[property]}
        onChange={base.utils.stopPropagationWrapper(this.onNumberChange.bind(this))}
        type='number' />
    );
  }

  onNumberChange(event) {
    const value = parseFloat(event.target.value);
    if(!isNaN(value)) {
      this.changeProp(event.target.value);
    }
  }

  renderBoolean() {
    const { project, object, property } = this.props;
    return (
      <mui.Checkbox
        id={`${project.uid}:${property}`}
        checked={object[property] === 'true'}
        onCheck={base.utils.stopPropagationWrapper(this.onBooleanChange.bind(this))} />
    );
  }

  onBooleanChange(event, isInputChecked) {
    setTimeout(
      () => this.changeProp(isInputChecked ? 'true' : 'false'),
      0
    );
  }

  changeProp(text) {
    const { project, object, property } = this.props;

    object[property] = text;
    Facade.projects.dirtify(project);
  }

  render() {
    const { type } = this.props;

    switch(type) {
    case 's':
      return this.renderString();
    case 'i':
      return this.renderInteger();
    case 'n':
      return this.renderNumber();
    case 'b':
      return this.renderBoolean();
    default:
      return (<div>{`unsupported type: ${type}`}</div>);
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