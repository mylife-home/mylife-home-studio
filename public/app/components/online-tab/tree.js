'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';
import base from '../base/index';

import shared from '../../shared/index';

import TreeEntity from './tree-entity';

import OnlineStore from '../../stores/online-store';

class Tree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      entities: OnlineStore.getAll()
    }
  }

  componentDidMount() {
    OnlineStore.addChangeListener(this.handleStoreChange.bind(this));
  }

  componentWillUnmount() {
    OnlineStore.removeChangeListener(this.handleStoreChange.bind(this));
  }

  handleStoreChange() {
    this.setState({
      entities: OnlineStore.getAll()
    });
  }

  handleSelectionChanged(value) {
    const selectedValueChanged = this.props.selectedValueChanged;
    if(selectedValueChanged) {
      selectedValueChanged(value);
    }
  }

  render() {
    const entities = this.state.entities
      .filter(entity => (entity.type != shared.EntityType.UNKNOWN))
      .map((entity) => (<TreeEntity key={entity.id} entity={entity} />));

    return (
      <base.SelectableList selectedValueChanged={this.handleSelectionChanged.bind(this)}>
        {entities}
      </base.SelectableList>
    );
  }
}

Tree.propTypes = {
  selectedValueChanged: React.PropTypes.func.isRequired
};

export default Tree;
