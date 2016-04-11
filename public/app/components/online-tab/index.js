'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import mui from 'material-ui';
import * as bs from 'react-bootstrap';

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
      <bs.Grid>
        <bs.Row>
          <bs.Col sm={3}>
            <Tree selectedValueChanged={this.handleSelectionChanged} />
          </bs.Col>
          <bs.Col sm={9}>main</bs.Col>
        </bs.Row>
      </bs.Grid>
    );
  }
}

export default OnlineTab;
