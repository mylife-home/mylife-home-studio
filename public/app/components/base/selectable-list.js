'use strict';

import React from 'react';
import * as mui from 'material-ui';

class SelectableList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selectedNode: props.selectedNode };
  }

  getChildContext() {
    return {
      changeSelectedNode: this.handleSelectionChange.bind(this),
      isSelectedNode:  this.isSelected.bind(this)
    };
  }

  isSelected(value) {
    return JSON.stringify(value) === JSON.stringify(this.state.selectedNode);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedNode) {
      this.setState({
        selectedNode: nextProps.selectedNode
      });
    }
  }

  handleSelectionChange(value) {
    if(this.isSelected(value)) {
      return;
    }

    this.setState({
      selectedNode: value
    });

    const handler = this.props.selectedValueChanged;
    if(handler) {
      handler(value);
    }
  }

  render() {

    const {selectedValueChanged, selectedNode, children, ...otherProps } = this.props;
    void selectedValueChanged;
    void selectedNode;

    return (
      <mui.List {...otherProps}>
        {children}
      </mui.List>
    );
  }
}

SelectableList.childContextTypes = {
  changeSelectedNode: React.PropTypes.func,
  isSelectedNode: React.PropTypes.func
};

SelectableList.propTypes = {
  selectedValueChanged: React.PropTypes.func,
  selectedNode: React.PropTypes.object,
  children: React.PropTypes.arrayOf(React.PropTypes.node)
};

export default SelectableList;