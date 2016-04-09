'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';

import Tree from './tree';

import OnlineStore from '../../stores/online-store';

class OnlineTab extends React.Component {

  constructor(props) {
    super(props);
  }

  handleSelectionChanged(value) {
    console.log('selection changed', value);
    // TODO
  }

  render() {
    return (
      <Tree selectedValueChanged={this.handleSelectionChanged} />
    );
  }
}

export default OnlineTab;
