'use strict';

import React from 'react';

import Tree from '../../components/online-tab/tree';

import OnlineStore from '../../stores/online-store';

class TreeContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      entities: OnlineStore.getAll()
    };

    this.boundHandleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    OnlineStore.addChangeListener(this.boundHandleStoreChange);
  }

  componentWillUnmount() {
    OnlineStore.removeChangeListener(this.boundHandleStoreChange);
  }

  handleStoreChange() {
    this.setState({
      entities: OnlineStore.getAll()
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
