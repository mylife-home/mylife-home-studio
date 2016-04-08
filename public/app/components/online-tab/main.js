'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';

import TreeEntity from './tree-entity';

import OnlineStore from '../../stores/online-store';

class OnlineTab extends React.Component {

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
    const entities = this.state.entities.map((entity) => {
      return (
        <TreeEntity key={entity.id} entity={entity}/>
      );
    });

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

export default OnlineTab;