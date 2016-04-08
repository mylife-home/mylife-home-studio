'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';

import shared from '../../shared/index';

import TreeEntity from './tree-entity';

import OnlineStore from '../../stores/online-store';

class Tree extends React.Component {

  constructor(props) {
    super(props);
    this.state = getStateFromStores();
  }

  componentDidMount() {
    OnlineStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    OnlineStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    this.setState(getStateFromStores());
  }

  render() {
    const entities = this.state.entities
      .filter(e => e.type != shared.EntityType.UNKNOWN)
      .map((entity) => (<TreeEntity key={entity.id} entity={entity} />));

    return (
      <mui.List>
        {entities}
      </mui.List>
    );
  }
}

function getStateFromStores() {
  return {
    entities: OnlineStore.getAll()
  };
}

export default Tree;