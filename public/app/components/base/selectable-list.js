'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';

class SelectableList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { selectedNode: null };
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

    return (
      <mui.List {...this.props} {...this.state}>
        {this.props.children}
      </mui.List>
    );
  }
}

SelectableList.childContextTypes = {
  changeSelectedNode: React.PropTypes.func,
  isSelectedNode: React.PropTypes.func
};

SelectableList.propTypes = {
  selectedValueChanged: React.PropTypes.func
};

export default SelectableList;