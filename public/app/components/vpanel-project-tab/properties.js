'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import * as mui from 'material-ui';
import * as bs from 'react-bootstrap';
import base from '../base/index';

import ProjectStore from '../../stores/project-store';
import ProjectStateStore from '../../stores/project-state-store';
import ProjectActionCreators from '../../actions/project-action-creators';

class Properties extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selection: null
    };
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this.handleStoreChange.bind(this));
    ProjectStateStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    ProjectStore.addChangeListener(this.handleStoreChange.bind(this));
    ProjectStateStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
    const { project } = this.props;
    const projectState = ProjectStateStore.getProjectState(project);
    this.setState({
      selection : projectState.selection
    });
  }

  renderTitle() {
    const { selection } = this.state;

    if(!selection) {
      return (<div>PROJECT</div>);
    }

    switch(selection.type) {
    case 'component':
      return (<div>COMPONENT {selection.id}</div>);

    case 'binding':
      return (<div>BINDING</div>);
    }
  }

  render() {
    const { project } = this.props;
    const { selection } = this.state;

    return (
      <div>
        PROPERTIES
        {this.renderTitle()}
      </div>
    );
  }
}

Properties.propTypes = {
  project: React.PropTypes.object.isRequired,
};

export default Properties;