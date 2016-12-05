'use strict';

import React from 'react';

import Tree from '../../components/online-tab/tree';

import OnlineStore from '../../stores/online-store';
import storeHandler from '../../compat/store';

const getAll = () => storeHandler.getStore().getState().online.toArray()

class TreeContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      entities: getAll()
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = storeHandler.getStore().subscribe(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleStoreChange() {
    this.setState({
      entities: getAll()
    });
  }

  render() {
    const { selectedValueChanged, selectedNode } = this.props;
    const { entities } = this.state;

    return (<Tree
      selectedValueChanged={selectedValueChanged}
      selectedNode={selectedNode}
      entities={entities}/>);
  }
}

TreeContainer.propTypes = {
  selectedValueChanged: React.PropTypes.func.isRequired,
  selectedNode: React.PropTypes.object
};

export default TreeContainer;
