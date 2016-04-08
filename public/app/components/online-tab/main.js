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

  render() {
    return (
      <Tree />
    );
  }
}

export default OnlineTab;